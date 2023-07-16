const { getDB } = require('../database');
const Config = require('../config/config');
const { ObjectId } = require('mongodb');

class User {
  static colletionName = 'Users';

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
      const query = { _id: ObjectId(userId) };
      const user = await db.collection(this.collectionName).findOne(query);
      return user;
    } catch (error) {
      console.error('Error occurred during user retrieval:', error);
      throw new Error('Failed to retrieve user. Please try again later.');
    }
  }
}

module.exports = User;
