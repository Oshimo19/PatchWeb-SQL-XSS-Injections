// backend/routes/populate.routes.js

const express = require("express");
const router = express.Router();
const { populateCtrl } = require("../controllers/populate.controller");

router.route("/populate")
  .post(populateCtrl)
  .all((req, res) =>
    res.status(405).json({ error: "Méthode non autorisée" })
  );

module.exports = router;
