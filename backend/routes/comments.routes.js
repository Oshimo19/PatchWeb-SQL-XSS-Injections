// backend/routes/comments.routes.js

const express = require("express");
const router = express.Router();
const {
  postComment,
  getComments
} = require("../controllers/comments.controller");

router.route("/comment")
  .post(postComment)
  .all((req, res) =>
    res.status(405).json({ error: "Méthode non autorisée" })
  );

router.route("/comments")
  .get(getComments)
  .all((req, res) =>
    res.status(405).json({ error: "Méthode non autorisée" })
  );

module.exports = router;
