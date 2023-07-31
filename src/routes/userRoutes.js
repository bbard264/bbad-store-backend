const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');
const upload = require('../config/services/multerUpload');

const authentication = passport.authenticate('jwt', { session: false });

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/getUserById', authentication, userController.getUserInfo);
router.put(
  '/updateUser',
  authentication,
  upload.single('img'),
  userController.updateUserInfo
);
router.put(
  '/changePassword',
  authentication,
  userController.changeUserPassword
);

router.get('/getFavorite', authentication, userController.getFavorite);
router.put('/addFavorite', authentication, userController.addFavorite);
router.delete('/removeFavorite', authentication, userController.removeFavorite);

router.get('/checkAuthentication', authentication, userController.checkAuthen);

module.exports = router;
