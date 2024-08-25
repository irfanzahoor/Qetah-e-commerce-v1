function card(item) {
  return `
  <tr>
    <td scope="row">${item.name}</td>
    <td>${item.first_name + " "+ item.last_name}</td>
    <td>${item.email}</td>
    <td>${item.payment_id}</td>
    <td>${item.tax}</td>
    <td>${item.subtotal}</td>
    <td>${item.total}</td>
    <td><a href="/order/${item.name}/" class="btn btn-sm btn-pill btn-dark">Details</a></td>
  </tr>`;
}

function listing(page = 1, append = true) {
  let count = document?.querySelector("#count");
  let output = document.querySelector("#listing");
  let loadmore = document.querySelector("#loadmore");
  let sort = document.querySelector("#sort").value;
  let template = "";
  let query = searchParams({
    limit: 6,
    page: page,
    sort: sort,
  });

  fetch(ApiUrl("qetah.events.orders.listing/?" + query))
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      data = data.message;
      if (data.count == 0) {
        count ? (count.innerHTML = "(0)") : null;
        output.innerHTML = "<p class='no-records'>No products exists!</p>";
      } else if (data.count != 0) {
        count ? (count.innerHTML = "(" + data.count + ")") : null;
        data.results.forEach((item) => { template += card(item);});
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
    .finally(() => {});
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
