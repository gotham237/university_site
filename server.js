const express = require("express");
const dotenv = require("dotenv");
//const createDB = require('./database');
const path = require("path");
const mysql2 = require("mysql2");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");

const app = express();

dotenv.config({ path: "./config.env" });

//middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  console.log("send index");
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

//Routes
app.use("/api/v1/users", userRouter);

app.get("/loginSignup", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/loginRegisterForm.html"));
});

const port = process.env.PORT || 1338;

const server = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
