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

describe("GET by ID", () => {
  it("200: should respond with a single review ", () => {
    const REVIEW_ID = 3;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: REVIEW_ID,
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          review_body: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  it("404: should receive correct error when passed invalid id", () => {
    return request(app)
      .get(`/api/reviews/??`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found!");
      });
  });
});
