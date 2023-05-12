import "@babel/polyfill";
import { login, signup } from "./loginSignup";

let signupBtn = document.getElementById("signup-btn");
let loginBtn = document.getElementById("login-btn");
let subjectButtton = document.getElementById('subject-enroll');

if (signupBtn) {
  signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let firstName = document.getElementById("signup-firstName").value;
    let lastName = document.getElementById("signup-lastName").value;
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-pass").value;
    signup(firstName, lastName, email, password);
  });
}
if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-pass").value;
    login(email, password);
  });
}

if(subjectButtton) {
  subjectButtton.addEventListener('click', (e) => {
    e.preventDefault();
     const { subject } = e.target.dataset; // e.target is button which was clicked
     applySubject(subject);
  })
}


