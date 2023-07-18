const Category = require('../models/category');

exports.getCategoryLastPage = async (req, res) => {
  try {
    const categoryMap = await Category.buildCategoryMap();
    res.json(categoryMap);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve category&Lastpage' });
  }
};
