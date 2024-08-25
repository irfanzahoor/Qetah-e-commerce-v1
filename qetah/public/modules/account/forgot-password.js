on("submit", "#forgot-password", function (e) {
  e.preventDefault();
  const form = e.target;
  let email = form.querySelector("#email").value;
  let btn = form.querySelector("#btn");

  if (!email || email == "") {
    $msg({
      title: "Error",
      desc: "Email is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else {
    btn.innerHTML = "Loading...";
    btn.setAttribute("disabled", true);

    fetch("/api/method/frappe.core.doctype.user.user.reset_password", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "X-Frappe-CSRF-Token": csrf_token(),
      }),
      body: JSON.stringify({
        user: email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message == "not found") {
          $msg({
            title: "Oops",
            desc: "This email does't exists!",
            icon: "bx-x-circle",
            type: "danger",
          });
        } else if (data?.exception) {
          $msg({
            title: "Oops",
            desc: data.exception.replace(
              "frappe.exceptions.ValidationError:",
              ""
            ),
            icon: "bx-x-circle",
            type: "danger",
          });
        } else {
          $msg({
            title: "Good",
            desc: "We sent you an email on your email account!",
            icon: "bx-check-circle",
            type: "success",
          });
        }
      })
      .finally(() => {
        btn.innerHTML = "Proceed";
        btn.removeAttribute("disabled", false);
      });
  }
});
