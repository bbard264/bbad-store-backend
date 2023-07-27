const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const passport = require('passport');

const authentication = passport.authenticate('jwt', { session: false });

router.get('/getCart', authentication, orderController.getCart);
router.put('/addToCart', authentication, orderController.addToCart);
router.put('/removeFromCart', authentication, orderController.removeFromCart);
router.post('/createOrder', authentication, orderController.createOrder);
router.get('/getOrders', authentication, orderController.getOrder);
router.get('/getOrderStatus', authentication, orderController.getOrderStatus);

module.exports = router;
