const { getDB } = require('../database');
const { ObjectId } = require('mongodb');

class Order {
  static CartCollections = 'Carts';
  static OrderCollections = 'Orders';

  static async getCart(props) {
    try {
      const db = getDB();
      const cart = await db
        .collection(this.CartCollections)
        .findOne({ user_id: new ObjectId(props.user_id) });
      let products;

      if (cart && cart.items && cart.items.length > 0) {
        const productIds = cart.items.map(
          (product_id) => new ObjectId(product_id)
        );
        products = await db
          .collection('Products')
          .find({ _id: { $in: productIds } })
          .project({
            _id: 1,
            product_name: 1,
            product_price: 1,
            product_url_name: 1,
            option: 1,
            product_photo: { $slice: 1 },
          })
          .toArray();
      }

      if (!cart) {
        // If cart not found, create a new cart document and insert it into the database
        const newCart = {
          user_id: new ObjectId(props.user_id),
          items: [],
          updated_at: new Date(),
        };
        await db.collection(this.CartCollections).insertOne(newCart);
        return { getCart: true, message: 'New cart created', data: newCart };
      }
      if (!cart.items) {
        await db.collection(this.CartCollections).updateOne(
          { user_id: new ObjectId(props.user_id) },
          { $set: { items: [] } } // Update items with a new array containing the new ObjectId(productId)
        );
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

  static async addToCart(props) {
    try {
      const db = getDB();

      const cart = await db
        .collection(this.CartCollections)
        .findOne({ user_id: new ObjectId(props.user_id) });

      if (!cart) {
        // If the user's cart doesn't exist, create a new cart and add the product to it.
        await db.collection(this.CartCollections).insertOne({
          user_id: new ObjectId(props.user_id),
          items: [new ObjectId(props.product_id)],
          updated_at: new Date(),
        });

        return { addToCart: true, message: `Create new Cart successful` };
      }

      // If cart exists but cart.items doesn't exist, set items to an empty array in the database.
      if (!cart.items) {
        await db.collection(this.CartCollections).updateOne(
          { user_id: new ObjectId(props.user_id) },
          { $set: { items: [new ObjectId(props.product_id)] } } // Update items with a new array containing the new ObjectId(productId)
        );
      } else {
        const itemsAsString = cart.items.map((item) => item.toString());
        const productIdAsObjectId = new ObjectId(props.product_id);

        if (!itemsAsString.includes(productIdAsObjectId.toString())) {
          // If the product doesn't already exist in the cart, add it to the cart.
          await db.collection(this.CartCollections).updateOne(
            { user_id: new ObjectId(props.user_id) },
            {
              $push: { items: new ObjectId(props.product_id) }, // Add new ObjectId(productId) to the existing items array
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
      }
    } catch (error) {
      console.error('Error occurred during adding product to cart:', error);
      return { addToCart: false, message: `Can't add product to cart` };
    }
  }

  static async removeFromCart(props) {
    try {
      const db = getDB();
      const query = { user_id: new ObjectId(props.user_id) };

      if (props.product_id === 'all') {
        const response = await db
          .collection(this.CartCollections)
          .updateOne(query, { $unset: { items: 1 } });
        return {
          removeFromCart: true,
          message: 'Remove all productId in cart',
        };
      } else {
        const response = await db
          .collection(this.CartCollections)
          .updateOne(query, {
            $pull: { items: new ObjectId(props.product_id) },
          });

        if (response.modifiedCount > 0) {
          return {
            removeFromCart: true,
            message: `Remove productId ${props.product_id} in cart`,
          };
        } else {
          return {
            removeFromCart: false,
            message: `Product with id ${props.product_id} not found in the cart`,
          };
        }
      }
    } catch (error) {
      console.error('Error occurred during remove product in cart:', error);
      return { removeFromCart: false, message: `Can't remove product in cart` };
    }
  }

  static async createOrder(props) {
    try {
      const orderData = { ...props, created_at: new Date().toISOString() };
      orderData.items.forEach((item) => {
        item.product_id = new ObjectId(item.product_id);
      });
      console.log(orderData);
      console.log(orderData.items[0]);
      const db = getDB();
      const result = await db
        .collection(this.OrderCollections) // Assuming this is the collection for orders
        .insertOne(orderData);

      return result.insertedId;
    } catch (error) {
      console.error('Error occurred during order creation:', error);
      throw new Error('Failed to create order. Please try again later.');
    }
  }

  static async getOrder(props) {
    try {
      const db = getDB();
      const result = await db
        .collection(this.OrderCollections)
        .find({ user_id: props.user_id })
        .toArray();

      return result;
    } catch (error) {
      console.error('Error occurred during getting order', error);
      throw new Error('Failed to get order. Please try again later.');
    }
  }
}

module.exports = Order;
