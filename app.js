const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const {
  getReviews,
  patchReviewsById,
  getReviewsById,
} = require("./controllers/reviews.controller");
const { getUsers } = require("./controllers/users.controller");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsById);
app.patch("/api/reviews/:review_id", patchReviewsById);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
});
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
