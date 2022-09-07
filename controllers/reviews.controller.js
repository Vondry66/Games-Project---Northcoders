const { selectReviews, updateReviewsById } = require("../models/reviews.model");

const getReviews = (req, res) => {
  const { review_id } = req.params;
  selectReviews(review_id).then((review) => {
    res.status(200).send({ review });
  });
};

const patchReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  const updateVotes = req.body;

  updateReviewsById(review_id, updateVotes)
    .then((updatedReviews) => {
      res.status(201).send({ updatedReviews });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = { getReviews, patchReviewsById };
