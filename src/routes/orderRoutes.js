const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const passport = require('passport');

const authentication = passport.authenticate('jwt', { session: false });

router.get('/getCart', authentication, orderController.getCart);
router.put('/addToCart', authentication, orderController.addToCart);
router.put('/removeFromCart', authentication, orderController.removeFromCart);

module.exports = router;
