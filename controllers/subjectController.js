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
        res.status(200).json({
          status: "success",
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
        res.status(200).json({
          status: "success",
          subject: result,
        });
      }
    });
  });
};

exports.checkIfApplied = (req, res, next) => {
  const subject = req.body;

  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch =
      "Select * from applications where applications.subjectName = ? and applications.user_id = ?";
    const search_query = mysql.format(sqlSearch, [
      subject[0].name,
      req.user.id,
    ]);
    connection.query(search_query, async (err, result) => {
      connection.release();
      if (result.length != 0) {
        res
          .status(404)
          .json({ message: "You have already applied on this subject" });
      } else {
        next();
      }
    });
  });
};

exports.apply = (req, res, next) => {
  const slug = req.params.slug;

  db.getConnection(async (err, connection) => {
    //console.log(req.user.id);
    if (err) throw err;
    const sqlSearch =
      "Select * from applications where applications.slug = ? and applications.user_id = ?";
    const search_query = mysql.format(sqlSearch, [slug, req.user.id]);
    connection.query(search_query, (err, result) => {
      if (err) throw err;
      connection.release();
      if (result.length != 0) {
           res
          .status(400)
          .json({ message: "You have already applied for this subject" });
      } else {
        const sqlSearch2 = "Select price from subjects where subjects.slug = ?";
        const search_query2 = mysql.format(sqlSearch2, [slug]);
        connection.query(search_query2, (err, result) => {

          if (err) throw err;
          connection.release();
          if (result.length == 0) {
            res.status(400).json({ message: "There is no such subject" });
          } else {
            const sqlInsert =
              "INSERT INTO applications(slug, price, dateOfPurchase, user_id) VALUES (?,?,?,?)";
            const insertQuery = mysql.format(sqlInsert, [
              slug,
              result[0].price,
              new Date(Date.now()),
              req.user.id,
            ]);
            connection.query(insertQuery, (err,result) => {
              if(err) throw err;
              connection.release();
              console.log(result);
              res.status(200).json({
                status: "success",
              });
            });
          }
        });
      }
    });
  });
};
