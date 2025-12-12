// backend/routes/index.js

const express = require("express");
const router = express.Router();

// Import de chaque groupe de routes
const healthRoutes   = require("./health.routes");
const populateRoutes = require("./populate.routes");
const usersRoutes    = require("./users.routes");
const queryRoutes    = require("./query.routes");
const commentsRoutes = require("./comments.routes");

// Montage des routes
router.use(healthRoutes);
router.use(populateRoutes);
router.use(usersRoutes);
router.use(queryRoutes);
router.use(commentsRoutes);

module.exports = router;
