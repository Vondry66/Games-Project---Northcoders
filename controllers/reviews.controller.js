const { selectReviews } = require("../models/reviews.model");

const getReviews = (req, res) => {
  const { review_id } = req.params;
  selectReviews(review_id).then((review) => {
    res.status(200).send({ review });
  });
};

module.exports = { getReviews };
