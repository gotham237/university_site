const mysql = require("mysql2");
const path = require("path");

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: null,
  database: process.env.DATABASE,
});

exports.getOverview = (req, res) => {
  db.getConnection((err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select courses.name, courses.summary from courses";
    const search_query = mysql.format(sqlSearch);
    console.log(sqlSearch);
    connection.query(search_query, async (err, result) => {
      connection.release();
      if (result.length === 0) {
        res.status(404).json({
          status: "fail",
          message: "There are no courses",
        });
      } else {
        res.status(200).render("overview", {
          title: "University",
          courses: result,
        });
      }
    });
  });
};

exports.getSubjects = (req, res) => {
  db.getConnection((err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from subjects";
    const search_query = mysql.format(sqlSearch);
    connection.query(search_query, async (err, result) => {
      connection.release();
      if (result.length === 0) {
        res.status(404).json({ message: "There are no subjects" });
      } else {
        res.status(200).render("subjects", {
          title: "Subjects",
          subjects: result,
        });
      }
    });
  });
};
exports.loadSubject = (req, res) => {
  const slug = req.params.slug;
  console.log(slug);
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from subjects where slug = ?";
    const search_query = mysql.format(sqlSearch, [slug]);
    connection.query(search_query, async (err, result) => {
      connection.release();
      if (result.length == 0) {
        res.status(404).json({ message: "There is no such subject" });
      } else {
        res.status(200).render("subject", {
          title: "subject",
          subject: result,
        });
      }
    });
  });
};

exports.getCourses = (req, res) => {
  db.getConnection((err, connection) => {
    //console.log('in get courses');
    if (err) throw err;
    const sqlSearch = "Select * from courses";
    const search_query = mysql.format(sqlSearch);
    connection.query(search_query, (err, result) => {
      connection.release();
      if (result.length === 0) {
        res.status(404).json({ message: "There are no courses" });
      } else {
        res.status(200).render("courses", {
          title: "Courses we offer",
          courses: result,
        });
      }
    });
  });
};

exports.getLoginSignup = (req, res) => {
  res.status(200).render("loginSignup", {
    title: "Login/Signup",
  });
};
