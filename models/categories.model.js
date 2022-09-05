const db = require("../db/connection");
const selectCategories = () => {
  return db.query("SELECT * FROM categories").then((response) => {
    return response.rows;
  });
};

module.exports = { selectCategories };
