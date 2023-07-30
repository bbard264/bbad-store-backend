const Reviews = require('../models/review');

exports.createNewReview = async (req, res) => {
  try {
    const user = {
      _id: req.user._id,
      displayname: req.user.displayname,
      photo: req.user.photo,
    };

    const newReviewId = await Reviews.createNewReview({ ...req.body, user });

    res.status(200).json({ isSuccess: true, data: newReviewId });
  } catch (error) {
    if (error.message === 'You have already reviewed this product.') {
      res.status(400).json({
        isSuccess: false,
        message: 'You have already reviewed this product.',
      });
    } else {
      console.error('Error occurred during review creation:', error);
      res.status(500).json({
        isSuccess: false,
        message: 'Failed to create the review. Please try again later.',
      });
    }
  }
};

exports.getReviews = async (req, res) => {
  try {
    let reviews;

    if (req.body.from === 'product') {
      reviews = await Reviews.getReviews({
        from: req.body.from,
        _id: req.body.product_id,
      });
    } else if (req.body.from === 'user') {
      reviews = await Reviews.getReviews({
        from: req.body.from,
        _id: req.user._id,
      });
    } else {
      // Invalid or missing 'from' value in the request body
      return res.status(400).json({
        isSuccess: false,
        message: 'Invalid or missing "from" value in the request body.',
      });
    }

    if (reviews.length === 0) {
      // No reviews found for the specified product/user
      return res.status(404).json({
        isSuccess: true,
        message: 'No reviews found for the specified product/user.',
        data: [],
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: 'Reviews retrieved successfully.',
      data: reviews,
    });
  } catch (error) {
    console.error('Error occurred during review retrieval:', error);
    res.status(500).json({
      isSuccess: false,
      message: 'Failed to get reviews. Please try again later.',
    });
  }
};

exports.removeReview = async (req, res) => {
  try {
    await Reviews.removeReview({ review_id: req.body._id });
    res
      .status(200)
      .json({ isSuccess: true, message: 'Review removed successfully.' });
  } catch (error) {
    if (error.message === 'Review not found. No review was removed.') {
      res.status(404).json({
        isSuccess: false,
        message: 'Review not found. No review was removed.',
      });
    } else {
      console.error('Error occurred during review removal:', error);
      res.status(500).json({
        isSuccess: false,
        message: 'Failed to remove the review. Please try again later.',
      });
    }
  }
};

exports.modifyReview = async (req, res) => {
  try {
    await Reviews.updateReviewById({
      _id: req.body._id,
      user_id: req.user._id,
      rate: req.body.rate,
      body: req.body.body,
    });

    res.status(200).json({
      isSuccess: true,
      message: 'Review modified successfully.',
    });
  } catch (error) {
    console.error('Error occurred during review modification:', error);
    if (error.message === 'No review found. Cannot modify the review.') {
      res.status(404).json({
        isSuccess: false,
        message: 'No review found. Cannot modify the review.',
      });
    } else if (
      error.message === 'You are not authorized to modify this review.'
    ) {
      res.status(403).json({
        isSuccess: false,
        message: 'You are not authorized to modify this review.',
      });
    } else {
      res.status(500).json({
        isSuccess: false,
        message: 'Failed to modify the review. Please try again later.',
      });
    }
  }
};
