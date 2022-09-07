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
          title: "Ultimate Werewolf",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "We couldn't find the werewolf!",
          category: "social deduction",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
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
describe("GET users", () => {
  it("200: should return an array with correct data eg. username,name,avatar url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  it("404: should return correct message when passed a wrong path ", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found!");
      });
  });
});

describe("201 : Patch reviews and votes", () => {
  it("should return an updated array ", () => {
    const REVIEW_ID = 2;
    const updatedVotes = {
      votes: 6,
    };
    return request(app)
      .patch(`/api/reviews/${REVIEW_ID}`)
      .send({ inc_votes: 1 })
      .expect(201)
      .then((response) => {
        const { body } = response;
        console.log(response.body);
        expect(body.updatedVotes).toEqual({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          ...updatedVotes,
        });
      });
  });
  it("should return an updated array ", () => {
    const REVIEW_ID = 3;
    const updatedVotes = {
      votes: -95,
    };
    return request(app)
      .patch(`/api/reviews/${REVIEW_ID}`)
      .send({ inc_votes: -100 })
      .expect(201)
      .then((response) => {
        const { body } = response;

        expect(body.updatedVotes).toEqual({
          review_id: 3,
          title: "Ultimate Werewolf",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "We couldn't find the werewolf!",
          category: "social deduction",
          created_at: "2021-01-18T10:01:41.251Z",
          ...updatedVotes,
        });
      });
  });
});
