const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error!" });
});

app.use((req, res, next) => {
  res.status(404).send({ msg: "Path not found!" });
});

module.exports = app;
