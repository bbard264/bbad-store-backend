const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authentication = require('../config/passport/authentication');

router.post(
  '/createNewReview',
  authentication,
  reviewController.createNewReview
);
router.get('/getReviewsByUser', authentication, reviewController.getReviews);
router.get('/getReviewsByProduct', reviewController.getReviews);
router.delete('/removeReview', authentication, reviewController.removeReview);
router.put('/modifyReview', authentication, reviewController.modifyReview);

module.exports = router;
