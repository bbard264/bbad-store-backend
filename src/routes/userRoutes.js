const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../config/services/multerUpload');
const authentication = require('../config/passport/authentication');

const checkIsDemo = (req, res, next) => {
  const isDemo = true;

  if (isDemo) {
    return res
      .status(403)
      .json({ message: 'Demo version: Cannot Create/Update User Infomation' });
  } else {
    next();
  }
};

const logRequests = (req, res, next) => {
  console.log('Received request:', req.url);
  next();
};

router.post('/register', checkIsDemo, userController.registerUser);
router.post('/login', logRequests, userController.loginUser);
router.get('/getUserById', authentication, userController.getUserInfo);
router.put(
  '/updateUser',
  checkIsDemo,
  authentication,
  upload.single('img'),
  userController.updateUserInfo
);
router.put(
  '/changePassword',
  checkIsDemo,
  authentication,
  userController.changeUserPassword
);

router.get('/getFavorite', authentication, userController.getFavorite);
router.put('/addFavorite', authentication, userController.addFavorite);
router.delete('/removeFavorite', authentication, userController.removeFavorite);

router.get('/checkAuthentication', authentication, userController.checkAuthen);

module.exports = router;
