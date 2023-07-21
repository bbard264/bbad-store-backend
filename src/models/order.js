const { getDB } = require('../database');
const { ObjectId } = require('mongodb');

class Order {
  static CartCollections = 'Carts';

  static async getCart(userId) {
    try {
      const db = getDB();
      const cart = await db
        .collection(this.CartCollections)
        .findOne({ user_id: new ObjectId(userId) });
      let products;

      if (cart && cart.items && cart.items.length > 0) {
        const productIds = cart.items.map(
          (productId) => new ObjectId(productId)
        );
        products = await db
          .collection('Products')
          .find({ _id: { $in: productIds } })
          .project({
            _id: 1,
            product_name: 1,
            product_price: 1,
            option: 1,
            product_photo: { $slice: 1 },
          })
          .toArray();
      } else {
        console.log("Cart is empty or doesn't exist.");
      }

      if (!cart) {
        // If cart not found, create a new cart document and insert it into the database
        const newCart = {
          user_id: new ObjectId(userId),
          items: [],
          updated_at: new Date(),
        };
        await db.collection(this.CartCollections).insertOne(newCart);
        return { getCart: true, message: 'New cart created', data: newCart };
      }

      return {
        getCart: true,
        message: 'Get cart successful',
        data: { ...cart, items: products },
      };
    } catch (error) {
      console.error('Error occurred during cart retrieval:', error);
      return {
        getCart: false,
        message: `Failed to retrieve cart. Please try again later.`,
      };
    }
  }

  static async addToCart(userId, productId) {
    try {
      const db = getDB();

      const cart = await db
        .collection(this.CartCollections)
        .findOne({ user_id: new ObjectId(userId) });

      if (!cart) {
        // If the user's cart doesn't exist, create a new cart and add the product to it.
        await db.collection(this.CartCollections).insertOne({
          user_id: new ObjectId(userId),
          items: [new ObjectId(productId)],
          updated_at: new Date(),
        });
        return { addToCart: true, message: `Create new Cart successful` };
      }

      const itemsAsString = cart.items.map((item) => item.toString());
      const productIdAsObjectId = new ObjectId(productId);

      if (!itemsAsString.includes(productIdAsObjectId.toString())) {
        // If the product doesn't already exist in the cart, add it to the cart.
        await db.collection(this.CartCollections).updateOne(
          { user_id: new ObjectId(userId) },
          {
            $push: { items: new ObjectId(productId) },
            $set: { updated_at: new Date() },
          }
        );
        return {
          addToCart: true,
          message: `Adding product to cart successful`,
        };
      } else {
        return { addToCart: true, message: `Item is Already Exist` };
      }
    } catch (error) {
      console.error('Error occurred during adding product to cart:', error);
      return { addToCart: false, message: `Can't add product to cart` };
    }
  }

  static async removeFromCart(userId, productId) {
    try {
      const db = getDB();
      const query = { user_id: new ObjectId(userId) };

      if (productId === 'all') {
        await db
          .collection(this.CartCollections)
          .updateOne(query, { $unset: { items: 1 } });
        return {
          removeFromCart: true,
          message: 'Remove all productId in cart',
        };
      } else {
        await db
          .collection(this.CartCollections)
          .updateOne(query, { $pull: { items: productId } });
        return {
          removeFromCart: true,
          message: `Remove productId ${productId} in cart`,
        };
      }
    } catch (error) {
      console.error('Error occurred during remove product in cart:', error);
      return { removeFromCart: false, message: `Can't remove product in cart` };
    }
  }
}

module.exports = Order;
