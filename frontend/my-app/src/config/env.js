// frontend/my-app/src/config/env.js
// Centralisation des variables d'environnement frontend

// En React (CRA / Vite), seules les variables préfixées sont exposées
const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  // Erreur volontairement explicite (fail fast)
  throw new Error(
    "REACT_APP_API_URL is not defined. Check your .env configuration."
  );
}

export { API_URL };
