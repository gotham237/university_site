const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const path = require('path');

require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  port: process.env.PORT_DB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  pool.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM university_db WHERE email = ?";
    const searchQuery = mysql.format(sqlSearch, [email]);
    const sqlInsert =
      "INSERT INTO university_db(firstName, lastName, email, hashedPassword) VALUES (?,?,?,?)";
    const insertQuery = mysql.format(sqlInsert, [
      firstName,
      lastName,
      email,
      hashedPassword,
    ]);
    connection.query(searchQuery, (err, result) => {
      //   if (err) throw (err)
      if (result.length != 0) {
        connection.release();
        res.status(400).json({
          status: "fail",
          message: "User with that email already exists!",
        });
      } else {
        connection.query(insertQuery, (err, result) => {
          connection.release();
          //  if (err) throw (err)
          res.status(200).json({
            status: "success",
            data: {
              result,
            },
          });
        });
      }
    });
  });
};
