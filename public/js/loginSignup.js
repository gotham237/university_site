import axios from "axios";
import { showAlert } from "./alerts.js";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in succesfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
    else {
      showAlert("fail", res.data.message);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
export const signup = async (firstName, lastName, email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: {
        firstName,
        lastName,
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Signed up succesfully!");
    }
  } catch (err) {
    console.log(err.response);
    showAlert("error", err.response.data.message);
  }
};
