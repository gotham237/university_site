const mysql = require("mysql2");

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

exports.getSubjects = (req, res) => {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from subjects";
    const search_query = mysql.format(sqlSearch);
    connection.query(search_query, async (err, result) => {
      connection.release();
      if (result.length == 0) {
        res.status(404).json({ message: "There are no subjects" });
      } else {
        res.status(200).render("subjects", {
          title: "Subjects",
          subjects: result
        });
      }
    });
  });
};

exports.loadSubject = (req,res) => {
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
          title: 'subject',
          subject: result
        });
      }
    });
  });
}
