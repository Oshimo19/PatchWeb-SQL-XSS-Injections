// backend/tests/query.test.js

const request = require("supertest");
const app = require("../server");
const sequelize = require("../config/database");
const User = require("../models/User");
const Comment = require("../models/Comment");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await User.create({ name: "Bob", password: "pass" }); // crée ID = 1
});

afterAll(async () => {
  await sequelize.close();
});

describe("Tests /query pour SQLi", () => {
  beforeAll(async () => {
    // insérer un utilisateur avant test
    await request(app).post("/user").send({
      name: "Bob",
      password: "pass"
    });
  });

  test("POST /query doit retourner un user quand ID est valide", async () => {
    const res = await request(app)
      .post("/query")
      .send({ id: "1" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name");
  });

  test("POST /query doit renvoyer 404 pour un ID inexistant", async () => {
    const res = await request(app)
      .post("/query")
      .send({ id: "999" });

    expect(res.statusCode).toBe(404);
  });

  const payloads = [
    "1 OR 1=1",
    "' OR '1'='1",
    "1; DROP TABLE users;",
    "abc",
    "0 UNION SELECT * FROM users",
    "<script>",
    "",
    " "
  ];

  payloads.forEach(p => {
    test(`POST /query doit bloquer "${p}"`, async () => {
      const res = await request(app)
        .post("/query")
        .send({ id: p });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  test("GET /query doit renvoyer 405", async () => {
    const res = await request(app).get("/query");
    expect(res.statusCode).toBe(405);
  });
});
