const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');

const authentication = passport.authenticate('jwt', { session: false });

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/getUserById', authentication, userController.getUserInfo);

module.exports = router;
