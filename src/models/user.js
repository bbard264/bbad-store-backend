const { getDB } = require('../database');
const { ObjectId } = require('mongodb');

class User {
  static collectionName = 'Users';
  static favoriteCollection = 'Favorites';

  static async checkDuplicateField(fieldName, fieldValue) {
    try {
      const db = getDB();
      const query = { [fieldName]: fieldValue };
      const existingValue = await db
        .collection(this.collectionName)
        .findOne(query);
      if (existingValue) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error occurred during duplicate field check:', error);
      throw new Error(
        'Failed to check duplicate field. Please try again later.'
      );
    }
  }

  static async createUser(userData) {
    try {
      const db = getDB();

      const result = await db
        .collection(this.collectionName)
        .insertOne(userData);

      return result.insertedId;
    } catch (error) {
      console.error('Error occurred during user creation:', error);
      throw new Error('Failed to create user. Please try again later.');
    }
  }

  static async getUserByEmail(email) {
    try {
      const db = getDB();
      const query = { email: email };
      const user = await db.collection(this.collectionName).findOne(query);
      return user;
    } catch (error) {
      console.error('Error occurred during user retrieval:', error);
      throw new Error('Failed to retrieve user. Please try again later.');
    }
  }

  static async getUserById(userId) {
    try {
      const db = getDB();
      const query = { _id: new ObjectId(userId) };
      const user = await db.collection(this.collectionName).findOne(query);
      return user;
    } catch (error) {
      console.error('Error occurred during user retrieval:', error);
      throw new Error('Failed to retrieve user. Please try again later.');
    }
  }

  static async updateUser(userId, updateData) {
    try {
      if (!!updateData.birthdate) {
        updateData.birthdate = new Date(updateData.birthdate);
      }
      if (!!updateData.photo && updateData.photo !== '') {
        updateData.photo = `/images/user/userphoto/${updateData.photo}`;
      }

      const db = getDB();
      const query = { _id: userId };
      const updateResult = await db
        .collection(this.collectionName)
        .updateOne(query, { $set: updateData });

      if (updateResult.modifiedCount === 1) {
        // Return true if the user was successfully updated
        return true;
      } else if (updateResult.matchedCount === 0) {
        // Throw an error if the user was not found
        throw new Error('User not found.');
      } else {
        // Return false if no changes were applied (data is the same)
        return false;
      }
    } catch (error) {
      console.error('Error occurred during user update:', error);
      throw new Error('Failed to update user. Please try again later.');
    }
  }

  static async getFavorite(props) {
    try {
      const db = getDB();
      const response = await db
        .collection(this.favoriteCollection)
        .findOne(props);

      if (!response) {
        // If no favorite record exists for the user, create a new one
        const newFavorite = {
          user_id: props.user_id,
          favorite_items: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        await db.collection(this.favoriteCollection).insertOne(newFavorite);

        return {
          getFavorite: true,
          message: 'Favorite retrieved successfully.',
          data: { favorite_items: [] },
        };
      } else if (
        Array.isArray(response.favorite_items) &&
        response.favorite_items.length === 0
      ) {
        // If the user has no favorite items yet
        return {
          getFavorite: true,
          message: 'Favorite retrieved successfully.',
          data: { favorite_items: [] },
        };
      } else {
        // User has favorite items, fetch the products
        const productIds = response.favorite_items.map(
          (product_id) => new ObjectId(product_id)
        );
        const products = await db
          .collection('Products')
          .find({ _id: { $in: productIds } })
          .toArray();

        return {
          getFavorite: true,
          message: 'Favorite retrieved successfully.',
          data: { favorite_items: products },
        };
      }
    } catch (error) {
      console.error('Error occurred during Favorite retrieval:', error);
      throw new Error('Failed to retrieve favorite. Please try again later.');
    }
  }

  static async addFavorite(props) {
    try {
      const db = getDB();
      const { user_id, product_id } = props;

      const query = { user_id };
      const response = await db
        .collection(this.favoriteCollection)
        .findOne(query);

      if (!response) {
        const newFavorite = {
          user_id,
          favorite_items: [new ObjectId(product_id)],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        await db.collection(this.favoriteCollection).insertOne(newFavorite);

        return { addFavorite: true, message: 'Favorite added successfully.' };
      } else {
        const updatedFavorite = {
          ...response,
          favorite_items: [
            ...response.favorite_items,
            new ObjectId(product_id),
          ],
          updated_at: new Date().toISOString(),
        };

        await db
          .collection(this.favoriteCollection)
          .updateOne(query, { $set: updatedFavorite });

        return { addFavorite: true, message: 'Favorite updated successfully.' };
      }
    } catch (error) {
      console.error('Error occurred while adding favorite:', error);
      throw new Error('Failed to add favorite. Please try again later.');
    }
  }

  static async removeFavorite(props) {
    try {
      const db = getDB();
      const { user_id, product_id } = props;

      if (product_id === 'all') {
        const query = { user_id };
        const update = {
          $set: { favorite_items: [], updated_at: new Date().toISOString() },
        };
        await db.collection(this.favoriteCollection).updateOne(query, update);

        return {
          removeFavorite: true,
          message: 'All favorites removed successfully.',
        };
      } else {
        const query = { user_id };
        const update = {
          $pull: { favorite_items: new ObjectId(product_id) },
          $set: { updated_at: new Date().toISOString() },
        };
        await db.collection(this.favoriteCollection).updateOne(query, update);

        return {
          removeFavorite: true,
          message: 'Favorite removed successfully.',
        };
      }
    } catch (error) {
      console.error('Error occurred while removing favorite:', error);
      throw new Error('Failed to remove favorite. Please try again later.');
    }
  }
}

module.exports = User;
