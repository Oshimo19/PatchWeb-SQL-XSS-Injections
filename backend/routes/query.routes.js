// backend/routes/query.routes.js

const express = require("express");
const router = express.Router();
const QueryController = require("../controllers/query.controller");

// POST /query => Cherche un utilisateur par ID
router.route("/query")
  .post(QueryController.queryUser)
  .all((req, res) => res.status(405).json({ error: "Méthode non autorisée" }));

module.exports = router;
