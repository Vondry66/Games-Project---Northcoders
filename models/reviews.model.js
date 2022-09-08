const db = require("../db/connection");
const selectReviewsById = (review_id) => {
  return db
    .query(
      `SELECT
    reviews.review_id,
    reviews.title,
    reviews.category,
    reviews.designer,
    reviews.owner,
    reviews.review_body,
    reviews.review_img_url,
    reviews.created_at,
    reviews.votes,
    COUNT (comments.review_id):: INT AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id=$1
    GROUP BY reviews.review_id
    `,
      [review_id]
    )
    .then((result) => {
      console.log(result.rows);
      const reviewID = result.rows[0];
      if (!reviewID) {
        return Promise.reject({
          status: 404,
          msg: `review ${review_id} doesn't exist`,
        });
      }
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

const selectReviews = (sort_by = "category", order = "desc", category) => {
  const validColumns = ["category", "created_at"];
  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request !" });
  }
  let queryStr = `SELECT
    reviews.review_id,
    reviews.title,
    reviews.category,
    reviews.designer,
    reviews.owner,
    reviews.review_body,
    reviews.review_img_url,
    reviews.created_at,
    reviews.votes,
    COUNT (comments.review_id):: INT AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id`;
  // let queryValue = [];
  if (category) {
    queryStr += ` WHERE reviews.category = $1 ORDER BY ${sort_by} ${order}`;
    return db
      .query(queryStr, [category])
      .then((result) => {
        return result.rows;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  queryStr += ` GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;`;
  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};

module.exports = { selectReviewsById, updateReviewsById, selectReviews };
