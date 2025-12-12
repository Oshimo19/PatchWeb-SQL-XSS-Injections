// backend/routes/health.routes.js

const express = require("express");
const router = express.Router();
const { healthCtrl } = require("../controllers/health.controller");

router.route("/health")
  .get(healthCtrl)
  .all((req, res) => res.status(405).json({ error: "Méthode non autorisée" }));

module.exports = router;
