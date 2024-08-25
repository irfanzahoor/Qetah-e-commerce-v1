on("click", "#btn1", function (e) {
  e.preventDefault();
  let id = document.querySelector("#id").value;
  let btn = e.target;

  btn.innerHTML = "Loading...";
  btn.setAttribute("disabled", true);

  fetch("/api/method/frappe.core.doctype.user.user.reset_password", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "X-Frappe-CSRF-Token": csrf_token(),
    }),
    body: JSON.stringify({
      user: id,
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
      }
    })
    .finally(() => {
      btn.innerHTML = "Send Password Reset Link";
      btn.removeAttribute("disabled", false);
    });
});

on("submit", "#profile-image", function (e) {
  e.preventDefault();
  const form = e.target;
  let image = form.querySelector("#image").files[0];
  let name = document.querySelector("#id").value;

  const formData = new FormData(form);
  formData.append("name", name);
  formData.append("image", image);

  fetch(ApiUrl("qetah.events.profile.profile_image"), {
    method: "POST",
    body: formData,
    headers: new Headers({
      "X-Frappe-CSRF-Token": csrf_token(),
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
    });
});
