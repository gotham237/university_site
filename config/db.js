const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER,
  procesz.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
  }
);
