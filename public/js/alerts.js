const btnsEdit = document.querySelectorAll(".btn-edit");
const formsDelete = document.querySelectorAll(".form-delete");

//Edit alert
btnsEdit.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    console.log(btn.href);
    e.preventDefault();
    Swal.fire({
      title: "Do you want to edit this entry?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = btn.href;
      }
    });
  });
});

//Delete alert
formsDelete.forEach((form) => {
  form.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(form);
    Swal.fire({
      title: "Do you want to delete this entry?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        form.submit();
      }
    });
  });
});
