function price(data) {
  if (data.price) {
    return `$<span>${data.price}</span>`;
  } else {
    return `$<span>${data.discount}</span><del>${data.price}<del>`;
  }
}

function card(item) {
  return `
  <article class="media media-product">
  <a class="media-image" href="/product/${item.name}/">
      <img src="${item.image}" class="image" alt="${item.alt}" />
  </a>
  <div class="media-body">
      <a href="/shop/${item.category_name}/" class="media-badge">${
    item.category_title
  }</a>
      <h3 class="media-title text-ellipsis">
          <a href="/product/${item.name}/">${item.title} (${
    item.variation
  }) </a>
      </h3>
      <p class="media-desc">${price(item)}</p>
      <button class="btn btn-pill btn-sm btn-primary remove_from_cart" data-type="summary" data-name="${
        item.cart_name
      }">
          Remove<i class="bx bx-trash icon-end"></i>
      </button>
  </div>
</article>
  `;
}

function listing(page = 1, append = true) {
  let count = document?.querySelector("#count");
  let output = document.querySelector("#listing");
  let loadmore = document.querySelector("#loadmore");
  let template = "";
  let subtotal = 0;
  let query = searchParams({
    limit: 6,
    page: page,
  });

  fetch(ApiUrl("qetah.events.cart.listing/?" + query))
    .then((res) => res.json())
    .then((data) => {
      data = data.message;
      if (data.count == 0) {
        count ? (count.innerHTML = "(0)") : null;
        output.innerHTML = "<p class='no-records'>No products exists!</p>";
      } else if (data.count != 0) {
        count ? (count.innerHTML = "(" + data.count + ")") : null;
        data.results.forEach((item) => {
          let price = item.discount
            ? parseFloat(item.discount)
            : parseFloat(item.price);
          subtotal += price;
          template += card(item);
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
    })
    .finally(() => {
      document.querySelector("#subtotal").innerHTML = "$" + subtotal;
      document.querySelector("#total").innerHTML = "$" + subtotal;
    });
}

listing();

on("change", "#sort", function (e) {
  e.preventDefault();
  listing(1, false);
});

on("submit", "#searchForm", function (e) {
  e.preventDefault();
  listing(1, false);
});

on("click", "#loadmore", function (e) {
  e.preventDefault();
  listing(e.target.value, true);
});

on("change", "[name='category']", function (e) {
  e.preventDefault();
  var values = [];
  document.querySelectorAll(".category").forEach((el) => {
    if (el.checked) {
      values.push(el.value);
    }
  });
  document.querySelector("#categories").value = values;
  listing(1, false);
});
