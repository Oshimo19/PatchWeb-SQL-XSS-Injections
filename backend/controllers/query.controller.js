// backend/controllers/query.controller.js
// Recherche sécurisée d’un utilisateur (anti-SQLi)

const UserService = require("../services/users.service");

// Vérifie que l'ID est strictement numérique
function isValidId(id) {
  return /^[0-9]+$/.test(id);
}

exports.queryUser = async (req, res) => {
  try {
    let { id } = req.body;

    if (!id) {     
      return res.status(400).json({ error: "Requête invalide." });
    }

    id = String(id).trim();

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Format non autorisé." });
    }

    const numericId = parseInt(id, 10);

    // Vérification d’existence via ORM
    if (!await UserService.userExists(numericId)) {
      return res.status(404).json({ error: "Aucun résultat." });
    }

    const user = await UserService.findUserById(numericId);
    return res.status(200).json(user);

  } catch (err) {
    console.error("Erreur interne (queryUser)");
    return res.status(500).json({ error: "Erreur interne." });
  }
};
