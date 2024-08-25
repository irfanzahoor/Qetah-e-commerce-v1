

on("submit", "#signup", function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  let first_name = form.querySelector("#first_name").value;
  let last_name = form.querySelector("#last_name").value;
  let email = form.querySelector("#email").value;
  let btn = form.querySelector("#btn");

  formData.append("full_name", first_name + " " + last_name);
  formData.append("email", email);
  formData.append("redirect_to", "/login");

  if (!first_name || first_name == "") {
    $msg({
      title: "Error",
      desc: "First Name is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else if (!last_name || last_name == "") {
    $msg({
      title: "Error",
      desc: "Last Name is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else if (!email || email == "") {
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

    fetch("/api/method/frappe.core.doctype.user.user.sign_up", {
      method: "POST",
      headers: new Headers({
        "X-Frappe-CSRF-Token": csrf_token(),
      }),
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data?.message[1] == "Already Registered") {
          $msg({
            title: "Oops",
            desc: "This email already exists!",
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
            title: "Success",
            desc: "Signup Successfully!",
            icon: "bx-check-circle",
            type: "success",
            close: true,
          });
        }

        // setTimeout(() => {
        //   window.location.href = "/";
        // }, 1000);
      })
      .finally(() => {
        btn.innerHTML = "Signup";
        btn.removeAttribute("disabled", false);
      });
  }
});
