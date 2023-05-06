const bcrypt = require("bcrypt");
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

dotenv.config({ path: "./config.env" });

// MySql
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  //Remove the password from the output
  user.password = undefined;
  console.log(token);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = async (req, res) => {
  console.log('signup server');
  const { firstName, lastName, email, password } = req.body;
  console.log(firstName, lastName, email, password, "nic");
  const hashedPassword = await bcrypt.hash(password, 10);

  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM users WHERE email = ?";
    const searchQuery = mysql.format(sqlSearch, [email]);
    const sqlInsert =
      "INSERT INTO users(firstName, lastName, email, password) VALUES (?,?,?,?)";
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
        connection.query(insertQuery, () => {
          connection.release();
          const user = req.body;
          createSendToken(user, 201, res);
        });
      }
    });
  });
};

exports.login = async (req,res) => {

  const { email, password } = req.body;
  db.getConnection(async (err, connection) => {
      if (err) throw (err);
      const sqlSearch = "Select * from users where email = ?"
      const search_query = mysql.format(sqlSearch, [email])
      connection.query(search_query, async (err, result) => {
          connection.release();
          if (result.length == 0) {
              res.status(404).json({message:'User does not exist'})
          }
          else {
              const hashedPassword = result[0].password
              if (await bcrypt.compare(password, hashedPassword)) {
                  const user = { email:result[0].email, firstName:result[0].firstName, lastName:result[0].lastName, id:result[0].id, password: hashedPassword };
                  
                  createSendToken(user, 201, res );
              }
              else {
                  res.status(200).send({message:'Incorrect password or email'});
              } 
          }
      }) 
  }) 
}