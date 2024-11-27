const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('web_trang_thong_tin', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;