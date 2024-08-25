on("click", ".remove_from_cart", function (e) {
  e.preventDefault();
  const btn = e.target;
  const id = btn?.getAttribute("data-name");
  const cart_name = btn?.getAttribute("data-cart-name");
  const type = btn?.getAttribute("data-type");
 

  btn.innerHTML = "Loading...";
  btn.setAttribute("disabled", true);

  fetch(ApiUrl("qetah.events.cart.remove_from_cart"), {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "X-Frappe-CSRF-Token": csrf_token(),
    }),
    body: JSON.stringify({
      id: id,
      cart_name: cart_name,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.message.success) {
        $msg({
          title: "Good",
          desc: "Item removed successfully!",
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
    })
    .finally(() => {
      if (type == "summary") {
        btn.parentElement.parentElement.remove();
        listing(1, false);
      } else {
        btn.innerHTML = "Add To Cart";
        btn.classList.add("add_to_cart");
        btn.classList.remove("remove_from_cart");
        btn.removeAttribute("disabled", false);
      }
    });
});
