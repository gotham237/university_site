const express = require("express");
const dotenv = require("dotenv");
//const createDB = require('./database');
const path = require("path");
const mysql = require("mysql2");
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

app.get("/baza", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    connection.query("SELECT * from users", (err, rows) => {
      connection.release();

      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    });
  });
});

const server = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
