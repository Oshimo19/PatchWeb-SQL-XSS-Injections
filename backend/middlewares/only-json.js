// backend/middlewares/only-json.js
// Limiter les entrees en JSON

module.exports = (req, res, next) => {
  const contentType = req.headers["content-type"];

  // Vérifier que le header existe et contient application/json
  if (!contentType || !contentType.includes("application/json")) {
    return res
      .status(415)
      .json({ error: "Format de requête non supporté." });
  }

  next();
};
