const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const passport = require('passport');

const authentication = passport.authenticate('jwt', { session: false });

router.post(
  '/createNewReview',
  authentication,
  reviewController.createNewReview
);
router.get('/getReviewsByUser', authentication, reviewController.getReviews);
router.get('/getReviewsByProduct', reviewController.getReviews);
router.put('/removeReview', authentication, reviewController.removeReview);
router.put('/modifyReview', authentication, reviewController.modifyReview);
module.exports = router;
