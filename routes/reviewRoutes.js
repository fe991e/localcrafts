const express = require('express');
const router = express.Router({mergeParams: true});
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewares.js');
const catchAsync = require('../utilits/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.postReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.delete))

module.exports = router;