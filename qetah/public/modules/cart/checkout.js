on("submit", "#checkout", function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  let firstname = form.querySelector("#firstname").value;
  let lastname = form.querySelector("#lastname").value;
  let email = form.querySelector("#email").value;
  let phone = form.querySelector("#phone").value;
  let country = form.querySelector("#country").value;
  let state = form.querySelector("#state").value;
  let city = form.querySelector("#city").value;
  let zip = form.querySelector("#zip").value;
  let address_1 = form.querySelector("#address_1").value;
  let address_2 = form.querySelector("#address_2").value;
  let token = form.querySelector("#token").value;
  let btn = document.querySelector("#btn");

  if (!firstname || firstname == "") {
    $msg({
      title: "Error",
      desc: "First Name is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else if (!lastname || lastname == "") {
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
      desc: "Email address is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else if (!phone || phone == "") {
    $msg({
      title: "Error",
      desc: "Phone number is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else if (!country || country == "") {
    $msg({
      title: "Error",
      desc: "Country is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else if (!state || state == "") {
    $msg({
      title: "Error",
      desc: "State is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else if (!city || city == "") {
    $msg({
      title: "Error",
      desc: "City is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else if (!zip || zip == "") {
    $msg({
      title: "Error",
      desc: "Zip code is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else if (!address_1 || address_1 == "") {
    $msg({
      title: "Error",
      desc: "Address is required!",
      icon: "bx-x-circle",
      type: "danger",
      close: true,
    });
  } else {
    btn.innerHTML = "Loading...";
    btn.setAttribute("disabled", true);

    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("country", country);
    formData.append("state", state);
    formData.append("city", city);
    formData.append("zip", zip);
    formData.append("address_1", address_1);
    formData.append("address_2", address_2);
    formData.append("token", token);

    fetch(ApiUrl("qetah.events.cart.checkout"), {
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
        if (data.message.success) {
          $msg({
            title: "Good",
            desc: "Checkout successfully!",
            icon: "bx-check-circle",
            type: "success",
            close: true,
          });
          setTimeout(() => {
            window.location.href = "/payment/" + data.message.name + "/";
          }, 1000);
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
        btn.innerHTML = "Checkout";
        btn.removeAttribute("disabled", false);
      });
  }
});
