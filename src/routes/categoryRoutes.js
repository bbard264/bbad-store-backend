const express = require('express');
const router = express.Router();
const Category = require('../models/category');

router.get('/categorylist', async (req, res) => {
  try {
    const categoryList = await Category.getCategoryList();
    res.json(categoryList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve category list' });
  }
});

module.exports = router;
