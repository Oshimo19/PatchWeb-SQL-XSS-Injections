// backend/services/users.service.js
// Services métier des utilisateurs : sécurité SQL via Sequelize ORM

const User = require("../models/User");

module.exports = {
  // Crée un utilisateur protégé par l'ORM
  async createUser(name, password) {
    return await User.create({ name, password });
  },

  // Retourne uniquement les IDs (surface exposée minimale)
  async getUsersIds() {
    return await User.findAll({
      attributes: ["id"],
    });
  },

  // Vérifie si un utilisateur existe (anti-bruteforce logique)
  async userExists(id) {
    const count = await User.count({
      where: { id },
    });
    return count > 0;
  },

  // Compte le nombre total d'utilisateurs (initialisation DB)
  async countUsers() {
    return await User.count();
  },

  // Récupère un utilisateur validé en amont (ID filtré)
  async findUserById(id) {
    return await User.findByPk(id, {
      attributes: ["id", "name"], // jamais password
    });
  }
};
