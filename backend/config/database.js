// backend/config/database.js
// Configuration de la base de donnees

const { Sequelize } = require("sequelize");
const { DB_PATH } = require("./env");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DB_PATH,
  logging: false,     // desactiver logs SQL
});

module.exports = sequelize;
