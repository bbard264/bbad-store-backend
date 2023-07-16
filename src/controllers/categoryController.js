const Category = require('../models/category');

exports.getCategoryList = async (req, res) => {
  try {
    const categoryList = await Category.getCategoryList();
    res.json(categoryList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve category list' });
  }
};
