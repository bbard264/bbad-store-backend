const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/getLastPage/:categoryId?', productController.getLastPage);

router.get(
  '/getProductsList/:categoryId?/:page?',
  productController.getProductsList
);

router.get('/getProductById/:productId?', productController.getProductById);
router.get('/getRecommendProduct', productController.getRecommendProduct);

module.exports = router;
