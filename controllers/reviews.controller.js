const {
  selectReviews,
  updateReviewsById,
  selectReviewsById,
} = require("../models/reviews.model");

const getReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
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
const getReviews = (req, res, next) => {
  const { sort_by, order_by, category } = req.params;
  selectReviews(sort_by, order_by, category)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getReviewsById, patchReviewsById, getReviews };
