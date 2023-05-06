console.log("Hello from bundler");
console.log('nic');
import "@babel/polyfill";
import { login, signup } from "./loginSignup";

let signupBtn = document.getElementById("signup-btn");
let loginBtn = document.getElementById("login-btn");

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
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-pass").value;
    login(email, password);
  });
}
