// backend/tests/users.test.js

const request = require("supertest");
const app = require("../server");
const { sequelize } = require("../models");
const User = require("../models/User");

describe("Tests /user et /users", () => {

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    // Créer au moins 1 utilisateur avant GET /users
    await User.create({ name: "Alice", password: "12345" });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("GET /users doit retourner la liste des IDs", async () => {
    const res = await request(app).get("/users");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("id");
  });

  test("POST /user doit créer un utilisateur valide", async () => {
    const res = await request(app)
      .post("/user")
      .send({ name: "Bob", password: "pass" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("id");
  });

  test("POST /user doit refuser caractères interdits", async () => {
    const res = await request(app)
      .post("/user")
      .send({ name: "<script>", password: "123" });

    expect(res.statusCode).toBe(400);
  });

  test("DELETE /users doit renvoyer 405 (méthode non autorisée)", async () => {
    const res = await request(app).delete("/users");
    expect(res.statusCode).toBe(405);
  });

});
