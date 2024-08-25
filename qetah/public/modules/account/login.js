on("submit", "#login", function (e) {
  e.preventDefault();
  const form = e.target;
  let email = form.querySelector("#email").value;
  let password = form.querySelector("#password").value;
  let btn = form.querySelector("#btn");

  if (!email || email == "") {
    $msg({
      title: "Oops",
      desc: "Email is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else if (!password || password == "") {
    $msg({
      title: "Oops",
      desc: "Password is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else {
    btn.innerHTML = "Loading...";
    btn.setAttribute("disabled", true);

    fetch("/api/method/login", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "X-Frappe-CSRF-Token": csrf_token(),
      }),
      body: JSON.stringify({
        usr: email,
        pwd: password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message == "Invalid login credentials") {
          $msg({
            title: "Oops",
            desc: "Invalid login credentials!",
            icon: "bx-x-circle",
            type: "danger",
            close: true,
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
            desc: "Login successfully!",
            icon: "bx-check-circle",
            type: "success",
            close: true,
          });

          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        }
      })
      .finally(() => {
        btn.innerHTML = "Login";
        btn.removeAttribute("disabled", false);
      });
  }
});
