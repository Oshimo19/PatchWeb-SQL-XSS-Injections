// backend/config/cors.js
// Configuration du CORS (origine strictement contrôlée)

const cors = require("cors");
const { FRONTEND_ORIGIN } = require("./env");

module.exports = function corsFactory() {
  if (!FRONTEND_ORIGIN) {
    throw new Error("FRONTEND_ORIGIN is not defined");
  }

  return cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  });
};
