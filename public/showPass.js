const btn = document.getElementById("show");
const leftbtn = document.getElementById("left-show");
const password = document.getElementById("pass");
const password1 = document.getElementById("pass1");

function change(){
  console.log(password1.type);
  if (password1.type == "password") {
    password1.type = "text";
    leftbtn.classList.remove("fa-eye-slash");
    leftbtn.classList.add("fa-eye");
  } else {
    password1.type = "password";
    leftbtn.classList.remove("fa-eye");
    leftbtn.classList.add("fa-eye-slash");
  }
}

function changePass(){
  console.log(password.type);
  if (password.type == "password") {
    password.type = "text";
    btn.classList.remove("fa-eye-slash");
    btn.classList.add("fa-eye");
  } else {
    password.type = "password";
    btn.classList.remove("fa-eye");
    btn.classList.add("fa-eye-slash");
  }
}
