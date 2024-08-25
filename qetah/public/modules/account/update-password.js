on("submit", "#update-password", function (e) {
  e.preventDefault();
  const form = e.target;
  let password = form.querySelector("#password").value;
  let cpassword = form.querySelector("#cpassword").value;
  let key = get_param("key");
  let btn = form.querySelector("#btn");

  if (!password || password == "") {
    $msg({
      title: "Error",
      desc: "New password is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else if (!cpassword || cpassword == "") {
    $msg({
      title: "Error",
      desc: "Confirm password is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else if (password != cpassword) {
    $msg({
      title: "Error",
      desc: "Password is mismatched!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else {
    btn.innerHTML = "Loading...";
    btn.setAttribute("disabled", true);

    fetch("/api/method/frappe.core.doctype.user.user.update_password", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "X-Frappe-CSRF-Token": csrf_token(),
      }),
      body: JSON.stringify({
        key: key,
        new_password: password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {

        if (
          data?.message ==
          "The reset password link has either been used before or is invalid"
        ) {
          $msg({
            title: "Oops",
            desc: "The reset password link has either been used before or is invalid",
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
            desc: "Password reset successfully!",
            icon: "bx-check-circle",
            type: "success",
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        }
      })
      .finally(() => {
        btn.innerHTML = "Change";
        btn.removeAttribute("disabled", false);
      });
  }
});
