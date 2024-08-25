on("submit", "#contact", function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  let fullname = document.querySelector("#fullname").value;
  let email = document.querySelector("#email").value;
  let phone = document.querySelector("#phone").value;
  let message = document.querySelector("#message").value;
  let btn = document.querySelector("#btn");

  formData.append("fullname", fullname);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("message", message);

  if (!fullname || fullname == "") {
    $msg({
      title: "Error",
      desc: "Full Name is required!",
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
  } else if (!message || message == "") {
    $msg({
      title: "Error",
      desc: "Message is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else {
    btn.innerHTML = "Loading...";
    btn.setAttribute("disabled", true);

    fetch(ApiUrl("qetah.events.contact.create/"), {
      method: "POST",
      body: formData,
      headers: new Headers({ "X-Frappe-CSRF-Token": csrf_token() }),
    })
      .then((res) => res.json())
      .then((data) => {
        form.reset();
        $msg({
          title: "Thanks for contacting us",
          desc: "Please expect reply from us on your given email in 1 business day",
          icon: "bx-check-circle",
          type: "success",
          close: true,
        });
      })
      .finally(() => {
        btn.innerHTML = "Send Message";
        btn.removeAttribute("disabled", false);
      });
  }
});
