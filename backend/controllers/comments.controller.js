// backend/controllers/comments.controller.js
// Stockage de commentaires encodés (anti-XSS)

const CommentService = require("../services/comments.service");
const escapeHTML = require("../middlewares/escape-html");

// POST /comment
exports.postComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Contenu invalide" });
    }

    const safeContent = escapeHTML(content);
    await CommentService.insertComment(safeContent);

    return res.status(201).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ce commentaire ne peut pas etre ajoute" });
  }
};

// GET /comments
exports.getComments = async (req, res) => {
  try {
    const comments = await CommentService.getComments();
    return res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Impossible de charger les commentaires."
    });
  }
};
