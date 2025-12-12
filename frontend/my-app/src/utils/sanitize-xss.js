// frontend/my-app/src/utils/sanitize-xss.js

export function sanitizePreview(str) {
  // Le backend encode déjà les caracteres → Aucune transformation frontend
  return String(str);
}
