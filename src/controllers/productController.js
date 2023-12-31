const Product = require('../models/product');

exports.getLastPage = async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const lastPage = await Product.getLastPage(categoryId);
    if (lastPage === undefined) {
      res.status(404).json({ error: 'Last page not found' });
    } else {
      res.status(200).send(lastPage.toString());
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve lastPage' });
  }
};

exports.getProductsList = async (req, res) => {
  const categoryId =
    req.params.categoryId === 'all' ? undefined : req.params.categoryId;
  const page = req.params.page ? parseInt(req.params.page) : 1;

  try {
    if (isNaN(page) || !Number.isInteger(page) || page < 1) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    const products = await Product.getListProducts(page, categoryId);
    if (products.length === 0) {
      return res.status(400).json({ error: 'No products found' });
    }

    res.json(products);
  } catch (error) {
    console.error(`Failed to Send Products List: ${error}`);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.getProductById(productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecommendProduct = async (req, res) => {
  try {
    const response = await Product.getRecommendProduct();
    res.status(200).json(response);
  } catch (error) {
    console.error('Failed to response recommend product', error);
    res
      .status(500)
      .json({ isSuccess: false, message: `can't get recomend product` });
  }
};
