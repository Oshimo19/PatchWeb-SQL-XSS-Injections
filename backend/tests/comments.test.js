// backend/tests/comments.test.js

const request = require("supertest");
const app = require("../server");
const sequelize = require("../config/database");
const User = require("../models/User");
const Comment = require("../models/Comment");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await Comment.destroy({ where: {} });
  await User.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Tests /comment et /comments pour XSS", () => {
  test("POST /comment doit accepter un texte valide", async () => {
    const res = await request(app)
      .post("/comment")
      .send({ content: "Bonjour" });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test("POST /comment doit encoder le contenu XSS", async () => {
    const payload = "<img src=x onerror=alert(1)>";
    await request(app).post("/comment").send({ content: payload });

    const res = await request(app).get("/comments");
    expect(res.statusCode).toBe(200);

    const c = res.body[0].content;
    expect(c.includes("<")).toBe(false);
    expect(c.includes(">")).toBe(false);
    expect(c).toMatch(/&[a-z]+;/i);
  });

  test("GET /comments doit retourner une liste", async () => {
    const res = await request(app).get("/comments");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("DELETE /comment doit renvoyer 405", async () => {
    const res = await request(app).delete("/comment");
    expect(res.statusCode).toBe(405);
  });
});
