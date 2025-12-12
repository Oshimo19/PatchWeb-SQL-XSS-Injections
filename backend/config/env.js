// backend/config/env.js
// Charger les donnees du fichier .env

require("dotenv").config();

module.exports = {
  // Port d exposition du Backend
  PORT: process.env.PORT || 8000,

  // Fichier SQLite utilise par Sequelize
  DB_PATH: process.env.DB_PATH,

  // Frontend autorise en CORS
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,

  // API du service randomuser
  RANDOMUSER_URL: process.env.RANDOMUSER_URL,
};
