const express = require("express");
const mysql = require("mysql2");
//const slugify = require('slugify');

// MySql
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: null,
  database: process.env.DATABASE,
});

exports.getAllCourses = (req, res) => {
  try {
    db.getConnection(async (err, connection) => {
      const sqlSearch = "Select * from courses";
      const search_query = mysql.format(sqlSearch);
      connection.query(search_query, async (err, result) => {
        connection.release();
        res.status(200).json({
          status: "success",
          courses: result,
        });
      });
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.buyCourse = (req, res, next) => {
  try {
    //console.log(req.user, " - user id");
    db.getConnection((err, connection) => {
      const sqlSearch = "SELECT * FROM payments WHERE user_id = ? AND slug = ?";
      console.log(req.user.id, req.params.slug);
      const search_query = mysql.format(sqlSearch, [
        req.user.id,
        req.params.slug,
      ]);
      connection.query(search_query, (err, result) => {
        console.log(result);
        if (result.length != 0) {
          return res.status(400).json({
            status: "fail",
            message: "You have already bought this course!",
          });
        }
        const sqlInsert =
          "INSERT INTO payments(type, user_id, purchase_date, slug) VALUES (?, ?, ?, ?)";
        const insert_query = mysql.format(sqlInsert, [
          "course",
          req.user.id,
          new Date(Date.now()),
          req.params.slug,
        ]);
        connection.query(insert_query, (err, result) => {
          connection.release();
          res.status(200).json({
            status: "success",
          });
        });
      });
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
