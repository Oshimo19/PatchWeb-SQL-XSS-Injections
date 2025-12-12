// backend/services/comments.service.js
// Services métier pour les commentaires : stockage encodé (anti-XSS)

const Comment = require("../models/Comment");

module.exports = {
  // Insère un commentaire déjà encodé côté contrôleur
  async insertComment(content) {
    return await Comment.create({ content });
  },

  // Liste des commentaires affichés en texte uniquement
  async getComments() {
    return await Comment.findAll({
      order: [["id", "DESC"]],
    });
  },

  // Vérifie l'existence (utile si un jour édition/suppression)
  async commentExists(id) {
    const count = await Comment.count({
      where: { id },
    });
    return count > 0;
  }
};
