const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapAsync');
const { validateReview, isReview } = require('../middleware')

const reviews = require('../controller/reviews')


router.post('/', validateReview, wrapAsync(reviews.newReview))

router.delete('/:reviewId', isReview, wrapAsync(reviews.deleteReview))

module.exports = router