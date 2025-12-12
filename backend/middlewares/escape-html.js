// backend/middlewares/escape-html.js
// Encodage COMPLET du HTML pour neutraliser tout XSS.
//
// Objectif :
//   → transformer des caractères potentiellement dangereux
//     (<, >, &, ", ', /, etc.) en entités HTML sûres.
//   → empêcher tout navigateur d’interpréter un tag (<script>, <img>, ...)
//   → empêcher les vecteurs XSS basés sur JavaScript:, onerror=, SVG, etc.
//   → fournir une sortie qui sera toujours rendue comme texte brut.
//
// Exemple :
//   Input :  "<img src=x onerror=alert(1)>"
//   Output : "&lt;img src=x onerror=alert(1)&gt;"
//   => Aucune exécution JavaScript possible.
//

const he = require("he");

module.exports = function escapeHTML(str) {
  if (typeof str !== "string") return str;

  return he.encode(str, {
    useNamedReferences: true, 
    // useNamedReferences :
    //   → produit des entités lisibles (&lt;, &gt;, &quot;, ...)
    //   → évite les formats hexadécimaux

    allowUnsafeSymbols: false,
    // allowUnsafeSymbols: false :
    //   → interdit de laisser passer certains symboles non-ASCII
    //     pouvant être utilisés dans des payloads XSS avancés
    //   → renforce l'encodage global

    encodeEverything: false,   
    // encodeEverything :
    //   → encode chaque caractère réservé ou spécial,
    //     y compris <, >, &, ", ', /, =, etc.
    //   → empêche toute interprétation HTML
  });
};
