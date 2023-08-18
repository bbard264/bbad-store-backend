const Config = require('../config/config');
const Order = require('../models/order');

exports.getCart = async (req, res) => {
  try {
    const response = await Order.getCart({ user_id: req.user._id });
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
  try {
    const response = await Order.addToCart({
      user_id: req.user._id,
      product_id: req.body.product_id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('Failed to add product to cart:', error);
    res
      .status(404)
      .json({ addToCart: false, message: `Can't add product to cart` });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const response = await Order.removeFromCart({
      user_id: req.user._id,
      product_id: req.query.product_id,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Failed to remove product from cart:', error);
    res.status(404).json({
      removeFromCart: false,
      message: `Can't remove product from cart`,
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const newOrder = req.body;
    const user_id = req.user._id;
    newOrder.user_id = user_id;
    const response = await Order.createOrder(newOrder);

    res.status(201).json({
      createOrder: true,
      message: `Order created successfully. Order ID:${response} `,
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    res
      .status(500)
      .json({ createOrder: false, message: `Failed to create order` });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const response = await Order.getOrder({ user_id: req.user._id });
    res.status(201).json({
      getOrder: true,
      message: `get Order Complete form user_id:${req.user._id} `,
      data: response,
    });
  } catch (error) {
    console.error('Failed to get order:', error);
    res.status(500).json({ getOrder: false, message: `Failed to get order` });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    const response = await Config.readConfigFile('Order_Status');
    res.status(201).json({
      getOrderStatus: true,
      message: `get Order status complete `,
      data: response,
    });
  } catch (error) {
    console.error('Failed to get order status:', error);
    res
      .status(500)
      .json({ getOrderStatus: false, message: `Failed to get order status` });
  }
};
