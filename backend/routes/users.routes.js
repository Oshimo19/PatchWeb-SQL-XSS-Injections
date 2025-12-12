// backend/routes/users.routes.js

const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users.controller");

// GET /users → Liste des IDs
router.route("/users")
  .get(UserController.listAllUsers)
  .all((req, res) => res.status(405).json({ error: "Méthode non autorisée" }));

// POST /user → Création utilisateur
router.route("/user")
  .post(UserController.createUser)
  .all((req, res) => res.status(405).json({ error: "Méthode non autorisée" }));

module.exports = router;