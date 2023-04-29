const express = require("express");
const dotenv = require("dotenv");
//const createDB = require('./database');
const path = require("path");
const mysql2 = require("mysql2");
const cookieParser = require('cookie-parser');

const userRouter = require("./routes/userRoutes");

const app = express();

dotenv.config({ path: "./config.env" });

//middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 1338;

// MySql
const pool = mysql2.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const server = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
