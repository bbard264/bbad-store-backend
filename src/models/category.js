const { getDB } = require('../database');

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
}

module.exports = Category;
