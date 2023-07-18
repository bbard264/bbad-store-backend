const { getDB } = require('../database');
const Product = require('../models/product');

class Category {
  static collectionName = 'Categories';
  static async getCategoryList() {
    const db = getDB();
    try {
      const categoryList = await db
        .collection(this.collectionName)
        .find()
        .toArray();
      return categoryList;
    } catch (error) {
      throw error;
    }
  }

  static async buildCategoryMap() {
    const categoryList = await this.getCategoryList();
    const lastPagePromises = categoryList.map(async (category) => {
      const lastPage = await Product.getLastPage(category._id);

      return {
        [category._id]: {
          value: { _id: category._id, category_name: category.category_name },
          lastPage,
        },
      };
    });

    const resolvedLastPageObjects = await Promise.all(lastPagePromises);
    const mergedCategoryMap = Object.assign({}, ...resolvedLastPageObjects);

    mergedCategoryMap.all = {
      value: 'all',
      lastPage: await Product.getLastPage(),
    };

    return mergedCategoryMap;
  }
}

module.exports = Category;
