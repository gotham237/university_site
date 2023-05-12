const bcrypt = require("bcrypt");
const path = require("path");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
//const { promisify } = require("util");
const { v4: uuidv4 } = require("uuid");

dotenv.config({ path: "./config.env" });

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  port: process.env.PORT_DB,
  password: null,
  database: process.env.DATABASE,
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  //Remove the password from the output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  console.log('signup server');
  const { firstName, lastName, email, password } = req.body;
  console.log(firstName, lastName, email, password);
  const hashedPassword = await bcrypt.hash(password, 10);

  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const id = uuidv4();
    //console.log(user.id, "user.id");
    const sqlSearch = "SELECT * FROM users WHERE email = ?";
    const searchQuery = mysql.format(sqlSearch, [email]);
    const sqlInsert =
      "INSERT INTO users(id, firstName, lastName, email, password) VALUES (?,?,?,?,?)";
    const insertQuery = mysql.format(sqlInsert, [
      id,
      firstName,
      lastName,
      email,
      hashedPassword,
    ]);
    connection.query(searchQuery, (err, result) => {
      console.log(result);
      if (err) throw err;
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
          user.id = id;
          createSendToken(user, 201, res);
        });
      }
    });
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from users where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    connection.query(search_query, async (err, result) => {
      connection.release();
      if (result.length == 0) {
        res.status(404).json({ message: "User does not exist" });
      } else {
        const hashedPassword = result[0].password;
        if (await bcrypt.compare(password, hashedPassword)) {
          const user = {
            email: result[0].email,
            firstName: result[0].firstName,
            lastName: result[0].lastName,
            id: result[0].id,
            password: hashedPassword,
          };

          createSendToken(user, 201, res);
        } else {
          res.status(200).send({ message: "Incorrect password or email" });
        }
      }
    });
  });
};

exports.protect = async (req, res, next) => {
  //1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401).json({
      status: "fail",
      message: "You are not logged in. Please login to get access",
    });
    next();
  }
  //2) Verificating the token

  //const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      res.status(403).send("Token invalid");
    } else {
      console.log(user);
      // 3) Check if user still exists
      db.getConnection(async (err, connection) => {
        if (err) throw err;
        const sqlSearch = "SELECT * FROM users WHERE id = ?";
        const search_query = mysql.format(sqlSearch, [user.id]);
        connection.query(search_query, async (err, result) => {
          connection.release();
          console.log(user, "from protect function");
          if (result.length == 0) {
            res.status(404).json({
              message: "User does not exist",
            });
          } else {
            //GRANT ACCESS TO PROTECTED ROUTE
            req.user = user;
            res.locals.user = user;
            next();
          }
        });
      });
    }
  });
};
