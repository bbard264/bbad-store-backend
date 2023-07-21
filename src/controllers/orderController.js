const Order = require('../models/order');

exports.getCart = async (req, res) => {
  const user = req.user._id;

  try {
    const response = await Order.getCart(user);
    res.status(200).json(response);
  } catch (error) {
    console.error('Failed to retrieve cart:', error);
    res.status(404).json({
      getCart: false,
      message: 'Failed to retrieve cart. Please try again later.',
    });
  }
};

exports.addToCart = async (req, res) => {
  const user = req.user._id;
  try {
    const response = await Order.addToCart(user, req.body.product_id);
    res.status(200).json(response);
  } catch (error) {
    console.error('Failed to add product to cart:', error);
    res
      .status(404)
      .json({ addToCart: false, message: `Can't add product to cart` });
  }
};

exports.removeFromCart = async (req, res) => {
  const user = req.user._id;
  const productId = req.body;
  try {
    const response = await Order.removeFromCart(user, productId);
    res.status(200).json(response);
  } catch (error) {
    console.error('Failed to remove product from cart:', error);
    res.status(404).json({
      removeFromCart: false,
      message: `Can't remove product from cart`,
    });
  }
};
