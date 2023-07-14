const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/products-lastpageNum/:categoryId?', async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const lastPage = await Product.getLastPage(categoryId);
    if (lastPage === undefined) {
      res.status(404).json({ error: 'Last page not found' });
    } else {
      res.send(lastPage.toString());
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve lastPage' });
  }
});

router.get('/products-list/:categoryId?/:page?', async (req, res) => {
  const categoryId =
    req.params.categoryId === 'all' ? undefined : req.params.categoryId;
  const page = req.params.page ? parseInt(req.params.page) : 1;

  try {
    if (isNaN(page) || !Number.isInteger(page) || page < 1) {
      console.log('Failed to Send Products List: Invalid page number');
      return res.status(400).json({ error: 'Invalid page number' });
    }

    const products = await Product.getListProducts(page, categoryId);
    if (products.length === 0) {
      console.log('Failed to Send Products List: No products found');
      return res.status(400).json({ error: 'No products found' });
    }

    res.json(products);
  } catch (error) {
    console.error(`Failed to Send Products List: ${error}`);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

router.get('/product/:productId?', async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.getProductById(productId);
    res.json(product);
  } catch (error) {
    console.log(`Failed to Send Productid ${productId}`);
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
