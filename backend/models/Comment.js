// backend/models/Comment.js
// Configuration de la table Comment qui stocke les commentaires

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define("Comment", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 3000]
    }
  },
});

module.exports = Comment;
