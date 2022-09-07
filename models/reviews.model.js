const db = require("../db/connection");
const selectReviews = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1;`, [review_id])
    .then((result) => {
      return result.rows[0];
    });
};

const updateReviewsById = (review_id, updateVotes) => {
  const revId = review_id;
  let votes = updateVotes.inc_votes;
  return db
    .query(
      `UPDATE reviews SET votes = votes+$1 WHERE 
    review_id=$2 RETURNING *;`,
      [votes, revId]
    )
    .then((result) => {
      const review = result.rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id:${review_id}`,
        });
      }
      return result.rows[0];
    });
};
module.exports = { selectReviews, updateReviewsById };
