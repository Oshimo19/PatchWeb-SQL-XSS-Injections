// backend/config/security-headers.js
// En-têtes de sécurité HTTP (OWASP)

const helmet = require("helmet");

module.exports = (app) => {
  // Retirer X-Powered-By
  app.disable("x-powered-by");

  app.use(
    helmet({
      // X-Frame-Options
      xFrameOptions: { action: "deny" },
      
      // X-Content-Type-Options
      xContentTypeOptions: true,
      
      // Referrer-Policy
      referrerPolicy: { policy: "no-referrer" },
      
      // HSTS désactivé (a activer uniquement si app en HTTPS)
      strictTransportSecurity: false,

      // Content-Security-Policy
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },

      // Isolation des ressources
      crossOriginOpenerPolicy: { policy: "same-origin" },
      crossOriginResourcePolicy: { policy: "same-origin" },

      // DNS prefetch désactivé
      xDnsPrefetchControl: { allow: false },

      // Interdire les policies cross-domain (Flash, etc.)
      permittedCrossDomainPolicies: { permittedPolicies: "none" },
    })
  );

  // Permissions-Policy (ancienne Feature-Policy) ajoutée manuellement
  app.use((req, res, next) => {
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );
    next();
  });

  // Supprimer X-XSS-Protection car obsolète
  app.use((req, res, next) => {
    res.removeHeader("X-XSS-Protection");
    next();
  });

  // Retirer le header "Server"
  app.use((req, res, next) => {
    res.removeHeader("Server");
    next();
  });
};
