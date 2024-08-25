function reviewItem(item) {
  let controls = "";
  if (item.is_owner) {
    controls = `
    <a href="javascript:void(0)" class="media-btn editReview" data-name="${item.name}">Edit</a>
    <a href="javascript:void(0)" class="media-btn deleteReview" data-name="${item.name}">Delete</a>`;
  }

  return `
    <div class="media media-image-rounded review">
    <a href="javascript:void(0)" class="media-image">
        <img src="${item.image}" alt="${
    item.first_name + "" + item.last_name
  }" class="image" />
    </a>
    <div class="media-body">
        <h3 class="media-title">
            <span> 
            ${item.first_name ? item.first_name : ""}
            ${item.last_name ? item.last_name : ""}
            </span> -
            ${timeAgo(item.creation)}
        </h3>
        <div class="media-desc" id="reviewText${item.name}">${
    item.content
  }</div>
        <div class="media-controls">${controls}</div>
    </div>
  </div>`;
}

function listing(page = 1, append = true) {
  let count = document?.querySelector("#reviews_count");
  let output = document.querySelector("#all_reviews");
  let loadmore = document.querySelector("#load_reviews");
  let sort = document.querySelector("#reviews_sort").value;
  let product = document.querySelector("#product").value;
  let template = "";
  let query = searchParams({
    limit: 6,
    page: page,
    product: product,
    sort: sort,
  });

  fetch(ApiUrl("qetah.events.review.listing/?" + query))
    .then((res) => res.json())
    .then((data) => {
      data = data.message;
      if (data.count == 0) {
        count
          ? (count.innerHTML = "(0)") /
            count.setAttribute("data-reviews-count", data.count)
          : null;

        output.innerHTML = "<p class='no-records'>Be first to place your comment!</p>";
      } else if (data.count != 0) {
        count
          ? (count.innerHTML = "(" + data.count + ")") /
            count.setAttribute("data-reviews-count", data.count)
          : null;
        data.results.forEach((item) => {
          template +=
            `<div id="review${item.name}">` + reviewItem(item) + `</div>`;
        });
        append ? (output.innerHTML += template) : (output.innerHTML = template);
      }
      if (loadmore) {
        if (data.next) {
          loadmore.value = data.next;
          loadmore.disabled = false;
          loadmore.style.display = "inline-block";
        } else {
          loadmore.value = 0;
          loadmore.disabled = true;
          loadmore.style.display = "none";
        }
      }
      console.log();
    })
    .finally(() => {});
}
listing();

on("change", "#reviews_sort", function (e) {
  e.preventDefault();
  listing(1, false);
});

on("click", "#load_reviews", function (e) {
  e.preventDefault();
  listing(e.target.value, true);
});

on("submit", "#createReview", function (e) {
  e.preventDefault();
  const form = e.target;
  const description = form.querySelector("#description").value;
  const product = form.querySelector("#product").value;
  const btn = form.querySelector("#reviewBtn");
  const count = document?.querySelector("#reviews_count");
  let counter = count.getAttribute("data-reviews-count");
  counter = parseInt(counter) + 1;

  if (!description || description == "") {
    $msg({
      title: "Error",
      desc: "Review field is empty!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else {
    btn.innerHTML = "Loading...";
    btn.setAttribute("disabled", true);

    fetch(ApiUrl("qetah.events.review.create"), {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "X-Frappe-CSRF-Token": csrf_token(),
      }),
      body: JSON.stringify({
        product: product,
        description: description,
        parent: null,
        stars: 4,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data = data.message;
        let reviews = document.querySelector("#all_reviews");
        if (counter != 1) {
          reviews.innerHTML =
            `<div id="review${data.name}">` +
            reviewItem(data) +
            `</div>` +
            reviews.innerHTML;
        } else {
          reviews.innerHTML =
            `<div id="review${data.name}">` + reviewItem(data) + `</div>`;
        }
        count.setAttribute("data-reviews-count", counter);
        count.innerHTML = "(" + counter + ")";
        form.reset();

        $msg({
          title: "Good",
          desc: "Review added successfully!",
          icon: "bx-check-circle",
          type: "success",
          close: true,
        });
      })
      .finally(() => {
        btn.innerHTML = "Add Review";
        btn.removeAttribute("disabled", false);
      });
  }
});

on("click", ".deleteReview", function (e) {
  e.preventDefault();
  const btn = e.target;
  const name = btn.getAttribute("data-name");
  const count = document?.querySelector("#reviews_count");
  let counter = count.getAttribute("data-reviews-count");
  counter = parseInt(counter) - 1;

  btn.innerHTML = "Loading...";
  btn.setAttribute("disabled", true);

  fetch(ApiUrl("qetah.events.review.delete"), {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "X-Frappe-CSRF-Token": csrf_token(),
    }),
    body: JSON.stringify({
      name: name,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.message.success) {
        $msg({
          title: "Good",
          desc: "Review deleted successfully!",
          icon: "bx-check-circle",
          type: "success",
          close: true,
        });
      } else {
        $msg({
          title: "Oops",
          desc: data.message.response,
          icon: "bx-x-circle",
          type: "danger",
          close: true,
        });
      }
      if (counter == 0) {
        document.querySelector("#all_reviews").innerHTML =
          "<p class='no-records'>No reviews exists!</p>";
      }
      count.setAttribute("data-reviews-count", counter);
      count.innerHTML = "(" + counter + ")";
      document.querySelector("#review" + name)?.remove();
    })
    .finally(() => {
      btn.innerHTML = "Delete";
      btn.removeAttribute("disabled", false);
    });
});

on("click", ".editReview", function (e) {
  e.preventDefault();
  const btn = document.querySelector("#reviewBtn");
  let name = e.target.getAttribute("data-name");
  let form = document.querySelector(".review-form");
  let field = document.querySelector("#description");
  field.value = document.querySelector("#reviewText" + name).innerText;
  field.placeholder = "Update your review";
  field.focus()
  field.scrollIntoView({
    block: "start",
    behavior: "smooth",
  });
  document.querySelector("#review_id").value = name;
  form.setAttribute("id", "updateReview");
  btn.innerText = "Update Review";
});

on("submit", "#updateReview", function (e) {
  e.preventDefault();
  let form = e.target;
  let description = form.querySelector("#description");
  let name = form.querySelector("#review_id").value;
  let btn = form.querySelector("#reviewBtn");

  if (!description.value || description.value == "") {
    $msg({
      title: "Error",
      desc: "Review field is empty!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else {
    btn.innerHTML = "Loading...";
    btn.setAttribute("disabled", true);

    fetch(ApiUrl("qetah.events.review.update"), {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "X-Frappe-CSRF-Token": csrf_token(),
      }),
      body: JSON.stringify({
        review_id: name,
        description: description.value,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data = data.message;
        form.setAttribute("id", "createReview");
        btn.innerText = "Add Review";
        description.placeholder = "Write your review";
        document.querySelector("#review" + name).innerHTML = reviewItem(data);
        $msg({
          title: "Good",
          desc: "Review updated successfully",
          icon: "bx-check-circle",
          type: "success",
          close: true,
        });
        form.reset();
      })
      .finally(() => {
        btn.innerHTML = "Add Review";
        btn.removeAttribute("disabled", false);
      });
  }
});
