on("click", "#logout", function (e) {
  e.preventDefault();

  fetch("/api/method/logout", {
    method: "POST",
    headers: new Headers({
      "X-Frappe-CSRF-Token": csrf_token(),
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      $msg({
        title: "Success",
        desc: "Logout Successfully!",
        icon: "bx-check-circle",
        type: "success",
        close: true,
      });

      setTimeout(() => {
        window.location.href = "/login/";
      }, 1000);
    });
});
