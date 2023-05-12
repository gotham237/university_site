import axios from "axios";
import { showAlert } from "./alerts.js";

export const applySubject = async (subject) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/subjects/:slug",
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