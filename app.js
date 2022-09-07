const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const {
  getReviews,
  patchReviewsById,
} = require("./controllers/reviews.controller");
const { getUsers } = require("./controllers/users.controller");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviews);
app.get("/api/users", getUsers);
app.patch("/api/reviews/:review_id", patchReviewsById);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((req, res, next) => {
  res.status(404).send({ msg: "Path not found!" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error!" });
});
module.exports = app;
