const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const courseRouter = require("./routes/courseRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

dotenv.config({ path: "./config.env" });

//middlewares
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// app.get("/loginSignup", (req, res) => {
//   res.sendFile(path.join(__dirname + "/public/loginRegisterForm.html"));
// });

//Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/", viewRouter);

const port = process.env.PORT || 1338;

const server = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
