// backend/server.js

require("dotenv").config();

const express = require("express");
const app = express();

const { PORT } = require("./config/env");
const sequelize = require("./config/database");
const applySecurityHeaders = require("./config/security-headers");
const corsFactory = require("./config/cors");
const onlyJson = require("./middlewares/only-json");
const routes = require("./routes");

// ========================
// MIDDLEWARES DE SECURITE
// ========================

// En-têtes HTTP stricts (OWASP)
applySecurityHeaders(app);

// Refuser tout autre format que JSON pour les méthodes avec corps
app.use((req, res, next) => {
  const methodsWithBody = ["POST", "PUT", "PATCH"];
  if (methodsWithBody.includes(req.method)) {
    return onlyJson(req, res, next);
  }
  next();
});

// Parsing JSON (après contrôle du Content-Type)
app.use(express.json({ limit: "100kb" }));

// CORS minimal et restreint
app.use(corsFactory());

// Routes de l'application
app.use(routes);

// ========================
// GESTION DES ROUTES INEXISTANTES (404)
// ========================
app.use((req, res) => {
  return res.status(404).json({
    error: "Ressource introuvable.",
  });
});

// ========================
// DEMARRAGE SERVEUR
// ========================

async function start() {
  try {
    // Vérification de la connexion DB
    await sequelize.authenticate();

    // Synchronisation ORM → création des tables
    await sequelize.sync();

    // Lancer le serveur uniquement si ce fichier est exécuté directement
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
      });
    }

  } catch (err) {
    // Message générique (aucune info interne)
    console.error("Erreur lors du démarrage du serveur.");
    process.exit(1);
  }
}

start();

module.exports = app;
