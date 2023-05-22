import axios from "axios";
import { showAlert } from "./alerts";

export const buyCourse = async (courseSlug) => {
  try {
    const res = await axios({
      method: "POST",
      url: `/api/v1/courses/buyCourse/${courseSlug}`,
    });

    if (res.data.status === "success") {
      showAlert("success", "You have succesfully bought the course");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      showAlert("error", res.data.message);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
