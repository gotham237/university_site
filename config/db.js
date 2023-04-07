const { Sequelize } = require('sequelize');

const createDB = new Sequelize('users_db', 'username', 'password', {
    host: './config/db.sqlite',
    dialect: 'sqlite'
});

module.exports = createDB;
