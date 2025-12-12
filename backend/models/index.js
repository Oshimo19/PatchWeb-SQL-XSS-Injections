// backend/models/index.js
// Centralisation des tables de la base de donnees

const sequelize = require("../config/database");
const User = require("./User");
const Comment = require("./Comment");

module.exports = {
  sequelize,
  User,
  Comment,
};
