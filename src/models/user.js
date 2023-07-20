const { getDB } = require('../database');
const Config = require('../config/config');
const { ObjectId } = require('mongodb');

class User {
  static collectionName = 'Users';

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
}

module.exports = User;
