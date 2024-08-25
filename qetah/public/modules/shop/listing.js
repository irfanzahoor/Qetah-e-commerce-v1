function card(item) {
  return `
    <div class="card card-product">
        <a href="/product/${item.name}/" class="card-image">
            <img src="${item.image}" class="image" alt="${item.alt}" />
        </a>
        <div class="card-body">
            <a href="/shop/${item.category}/" class="card-badge">${item.category}</a>
            <h3 class="card-title text-ellipsis">
                <a href="/product/${item.name}/">${item.title}</a>
            </h3>
            <p class="card-subtitle text-ellipsis-2">${item.excerpt}</p>
        </div>
        <div class="card-foot">
        <h3 class="card-subtitle">{{ item.price }}</h3>
            <div class="card-ratings ratings">
                <span class="bx bxs-star active"></span><b>5</b>
            </div>
        </div>
    </div>`;
}

function listing(page = 1, append = true) {
  let sort = document.querySelector("#sort");
  let count = document.querySelector("#count");
  let output = document.querySelector("#listing");
  let loadmore = document.querySelector("#loadmore");
  let categories = document.querySelector("#categories");
  let search = document.querySelector("#search");
  let template = "";

  let query = searchParams({
    limit: 6,
    page: page,
    sort: sort.value,
    categories: categories.value,
    search: search.value,
  });

  fetch(ApiUrl("qetah.events.products.listing/?" + query))
    .then((res) => res.json())
    .then((data) => {
      data = data.message;
      if (data.count == 0) {
        count.innerHTML = "(0)";
        output.innerHTML = "<p class='no-records'>No products exists!</p>";
      } else if (data.count != 0) {
        count.innerHTML = "(" + data.count + ")";
        data.results.forEach((item) => (template += card(item)));
        append ? (output.innerHTML += template) : (output.innerHTML = template);
      }

      if (data.next) {
        loadmore.value = data.next;
        loadmore.disabled = false;
        loadmore.style.display = "inline-block";
      } else {
        loadmore.value = 0;
        loadmore.disabled = true;
        loadmore.style.display = "none";
      }
    })
    .finally(() => {
      AOS.init();
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
