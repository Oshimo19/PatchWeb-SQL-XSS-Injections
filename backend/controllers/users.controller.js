// backend/controllers/users.controller.js
// Création d'utilisateur avec validation stricte (anti-XSS / anti-SQLi)

const UserService = require("../services/users.service");

function isSafeUserField(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;

  // Autorisé : lettres, chiffres, espace, ., -, _
  const SAFE_RE = /^[a-zA-Z0-9 _.-]{1,100}$/;
  return SAFE_RE.test(trimmed);
}

// GET /users → retourne uniquement les IDs
exports.listAllUsers = async (req, res) => {
  try {
    const rows = await UserService.getUsersIds();
    return res.status(200).json(rows);
  } catch {
    console.error("Erreur interne (listAllUsers)");
    return res.status(500).json({ error: "Erreur interne." });
  }
};

// POST /user → insertion sécurisée
exports.createUser = async (req, res) => {
  try {
    const { name, password } = req.body || {};

    if (!isSafeUserField(name) || !isSafeUserField(password)) {
      return res.status(400).json({
        error: "Champs invalides.",
      });
    }

    const user = await UserService.createUser(
      name.trim(),
      password.trim()
    );

    return res.status(201).json({ success: true, id: user.id });
  } catch {
    console.error("Erreur interne (createUser)");
    return res.status(500).json({ error: "Erreur interne." });
  }
};
