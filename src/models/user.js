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
      if (userData.email && userData.email.length > 100) {
        throw new Error('Email exceeds maximum length of 100 characters.');
      }

      if (userData.displayname && userData.displayname.length > 100) {
        throw new Error(
          'Display name exceeds maximum length of 100 characters.'
        );
      }

      const db = getDB();

      const result = await db
        .collection(this.collectionName)
        .insertOne(userData);

      const newUserId = result.insertedId;
      const photoPath = `/images/user/userphoto/${newUserId}-profile100x100.jpg`;

      await db
        .collection(this.collectionName)
        .updateOne({ _id: newUserId }, { $set: { photo: photoPath } });

      return newUserId;
    } catch (error) {
      console.error('Error occurred during user creation:', error);
      throw error;
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
      const db = getDB();
      console.log(updateData);

      // Query the existing user data
      const existingUser = await db
        .collection(this.collectionName)
        .findOne({ _id: userId });
      if (!existingUser) {
        throw new Error('User not found.');
      }
      console.log(existingUser);

      // Compare updateData with existingUser and create newUpdateData
      const newUpdateData = {};

      if (updateData.birthdate !== null && updateData.birthdate !== undefined) {
        const birthdate = new Date(updateData.birthdate);

        if (
          birthdate &&
          (existingUser.birthdate === undefined ||
            birthdate.toISOString() !== existingUser.birthdate.toISOString())
        ) {
          if (!isNaN(birthdate.getTime())) {
            newUpdateData.birthdate = birthdate;
          } else {
            throw new Error('Invalid birthdate.');
          }
        }
      }
      if (
        updateData.phone !== undefined &&
        updateData.phone !== existingUser.phone
      ) {
        newUpdateData.phone = updateData.phone;
      }

      if (updateData.gender && updateData.gender !== existingUser.gender) {
        newUpdateData.gender = updateData.gender;
      }

      if (
        updateData.email &&
        updateData.email !== existingUser.email &&
        updateData.email.length <= 100
      ) {
        const emailExists = await db
          .collection(this.collectionName)
          .findOne({ email: updateData.email });
        if (!emailExists || emailExists._id.toString() === userId) {
          newUpdateData.email = updateData.email;
        } else {
          throw new Error('Email already exists.');
        }
      }

      if (
        updateData.displayname &&
        updateData.displayname !== existingUser.displayname &&
        updateData.displayname.length <= 100
      ) {
        const displaynameExists = await db
          .collection(this.collectionName)
          .findOne({ displayname: updateData.displayname });
        if (!displaynameExists || displaynameExists._id.toString() === userId) {
          newUpdateData.displayname = updateData.displayname;
        } else {
          throw new Error('Display name already exists.');
        }
      }

      if (updateData.address) {
        const { address1, address2, district, province, postcode } =
          updateData.address;

        const isUpdateNeeded =
          address1 !== undefined ||
          address2 !== undefined ||
          district !== undefined ||
          province !== undefined ||
          postcode !== undefined;

        if (isUpdateNeeded) {
          const existingAddress = existingUser.address || {};
          if (
            address1 !== existingAddress.address1 ||
            address2 !== existingAddress.address2 ||
            district !== existingAddress.district ||
            province !== existingAddress.province ||
            postcode !== existingAddress.postcode
          ) {
            newUpdateData.address = {
              address1,
              address2,
              district,
              province,
              postcode,
            };
          }
        }
      }

      console.log(newUpdateData);
      // Update the user with newUpdateData
      const updateResult = await db
        .collection(this.collectionName)
        .updateOne({ _id: userId }, { $set: newUpdateData });

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
      throw error;
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
