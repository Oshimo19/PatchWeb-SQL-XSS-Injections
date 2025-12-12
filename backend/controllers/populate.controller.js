// backend/controllers/populate.controller.js

const axios = require("axios");
const { RANDOMUSER_URL } = require("../config/env");
const UserService = require("../services/users.service");
const escapeHTML = require("../middlewares/escape-html");

// POST /populate → Initialise la base avec 3 utilisateurs RandomUser
const populateCtrl = async (req, res) => {
  try {
    // 1. Idempotence
    const count = await UserService.countUsers();
    if (count > 0) {
      return res.status(409).json({
        message: "Database already initialized"
      });
    }

    // 2. Appels API RandomUser (3 users)
    const responses = await Promise.all(
      Array.from({ length: 3 }, () =>
        axios.get(RANDOMUSER_URL)
      )
    );

    let inserted = 0;

    for (const r of responses) {
      if (!r.data?.results?.[0]) continue;

      const u = r.data.results[0];

      const safeName = escapeHTML(
        `${u.name.first} ${u.name.last}`
      );
      const safePass = escapeHTML(u.login.password);

      await UserService.createUser(safeName, safePass);
      inserted++;
    }

    return res.status(200).json({ inserted });

  } catch (err) {
    console.error("populateCtrl error:", err);
    return res.status(500).json({ error: "Initialization failed" });
  }
};

module.exports = { populateCtrl };
