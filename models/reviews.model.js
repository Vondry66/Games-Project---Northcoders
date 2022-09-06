const db = require("../db/connection");
const selectReviews = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1;`, [review_id])
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = { selectReviews };
