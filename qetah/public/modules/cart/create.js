on("click", ".add_to_cart", function (e) {
  e.preventDefault();
  const btn = e.target;
  const id = btn.getAttribute("data-name");

  btn.innerHTML = "Loading...";
  btn.setAttribute("disabled", true);

  fetch(ApiUrl("qetah.events.cart.add_to_cart"), {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "X-Frappe-CSRF-Token": csrf_token(),
    }),
    body: JSON.stringify({
      id: id,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.message.success) {
        $msg({
          title: "Good",
          desc: "Item added successfully!",
          icon: "bx-check-circle",
          type: "success",
          close: true,
        });
      btn.setAttribute("data-name", data.message.product);
      btn.setAttribute("data-cart-name", data.message.name);

      } else {
        $msg({
          title: "Oops",
          desc: data.message.response,
          icon: "bx-x-circle",
          type: "danger",
          close: true,
        });
      }
    })
    .finally(() => {
      btn.innerHTML = "Remove";
      btn.classList.remove("add_to_cart");
      btn.classList.add("remove_from_cart");
      btn.removeAttribute("disabled", false);
    });
});
