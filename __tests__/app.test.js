const app = require("../app.js");
const request = require("supertest");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});
describe("GET", () => {
  it("200: should respond with an array of correct keys and values", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.categories)).toBe(true);
        body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
it("404: should return a correct error ", () => {
  return request(app)
    .get("/api/banana")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Path not found!");
    });
});
