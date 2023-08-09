const { getDB } = require('../database');
const Config = require('../config/config');
const { ObjectId } = require('mongodb');

class Product {
  static collectionName = 'Products';

  static async getListProducts(page, categoryId) {
    const db = getDB();
    let productPageOne = Config.readConfigFile('productPerPage')['PageOne'];

    const isCategoryId = categoryId ? { category_id: categoryId } : {};

    if (page === 1) {
      try {
        const products = await db
          .collection(this.collectionName)
          .find(isCategoryId)
          .limit(productPageOne)
          .toArray();

        if (categoryId && products.length === 0) {
          throw new Error('Invalid categoryId');
        }

        return products;
      } catch (error) {
        throw error;
      }
    } else {
      let productEachPage = Config.readConfigFile('productPerPage')['EachPage'];
      try {
        const products = await db
          .collection(this.collectionName)
          .find(isCategoryId)
          .skip(productPageOne + (page - 2) * 12)
          .limit(productEachPage)
          .toArray();

        if (categoryId && products.length === 0) {
          throw new Error('Invalid categoryId');
        }

        return products;
      } catch (error) {
        throw error;
      }
    }
  }

  static async getLastPage(categoryId) {
    const db = getDB();
    let productPageOne = Config.readConfigFile('productPerPage')['PageOne'];
    let productEachPage = Config.readConfigFile('productPerPage')['EachPage'];

    const isCategoryId = categoryId ? { category_id: categoryId } : {}; // Build the query based on the presence of categoryId

    try {
      const totalProducts = await db
        .collection(this.collectionName)
        .countDocuments(isCategoryId); // Count only the documents that match the categoryId

      if (totalProducts === 0) {
        return undefined;
      }
      const lastPage =
        Math.ceil(
          (parseInt(totalProducts) - productPageOne) / productEachPage
        ) + 1;
      return lastPage;
    } catch (error) {
      throw error;
    }
  }

  static async getProductById(productId) {
    const db = getDB();
    const object_id = new ObjectId(productId);
    try {
      const product = await db
        .collection(this.collectionName)
        .findOne({ _id: object_id });

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async getRecommendProduct() {
    try {
      const db = getDB();
      const recomendProductList = await db
        .collection(this.collectionName)
        .aggregate([{ $sample: { size: 8 } }])
        .toArray();
      return {
        isSuccess: true,
        message: 'get recomend product complete',
        data: recomendProductList,
      };
    } catch (error) {
      console.error('Error getting recommended products:', error);
      return { isSuccess: false, message: `can't get recomend product` };
    }
  }
}

module.exports = Product;
