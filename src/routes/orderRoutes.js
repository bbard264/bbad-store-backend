const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authentication = require('../config/passport/authentication');

router.get('/getCart', authentication, orderController.getCart);
router.put('/addToCart', authentication, orderController.addToCart);
router.delete(
  '/removeFromCart',
  authentication,
  orderController.removeFromCart
);
router.post('/createOrder', authentication, orderController.createOrder);
router.get('/getOrders', authentication, orderController.getOrder);
router.get('/getOrderStatus', authentication, orderController.getOrderStatus);

module.exports = router;
