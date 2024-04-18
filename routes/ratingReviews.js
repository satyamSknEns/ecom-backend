const express = require('express');
const ratingReviewsController = require('../controller/ratingReviews');

const router = express.Router();

router
  .post('/', ratingReviewsController.ratingReviews)
//   .get('/ratings', ratingReviewsController.getRatingReview)

exports.router = router;  