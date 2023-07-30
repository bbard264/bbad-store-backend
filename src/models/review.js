const { getDB } = require('../database');
const { ObjectId } = require('mongodb');

class Reviews {
  static collectionName = 'Reviews';

  static async createNewReview(props) {
    try {
      const db = getDB();

      // Check if the user has already reviewed the product
      const existingReview = await db.collection(this.collectionName).findOne({
        product_id: new ObjectId(props.product_id),
        user_id: new ObjectId(props.user._id),
      });

      if (existingReview) {
        throw new Error('You have already reviewed this product.');
      }

      const newReview = {
        product_id: new ObjectId(props.product_id),
        user_id: new ObjectId(props.user._id),
        user_display_name: props.user.displayname,
        user_photo: props.user.photo,
        rating: props.rate,
        body: props.body,
        created_at: new Date(),
        modify: false,
        updated_at: new Date(),
      };

      const result = await db
        .collection(this.collectionName)
        .insertOne(newReview);

      return result.insertedId;
    } catch (error) {
      console.error('Error occurred during review creation:', error);
      throw new Error('Failed to create review. Please try again later.');
    }
  }

  static async getReviews(props) {
    try {
      const db = getDB();
      if (props.from === 'user') {
        const reviews = await db
          .collection(this.collectionName)
          .find({ user_id: new ObjectId(props._id) })
          .toArray();
        return reviews;
      } else if (props.from === 'product') {
        const reviews = await db
          .collection(this.collectionName)
          .find({ product_id: new ObjectId(props._id) })
          .toArray();
        return reviews;
      }
    } catch (error) {
      console.error('Error occurred during review retriever:', error);
      throw new Error('Failed to get reviews. Please try again later.');
    }
  }

  static async removeReview(props) {
    try {
      const db = getDB();

      const result = await db
        .collection(this.collectionName)
        .deleteOne({ _id: new ObjectId(props.review_id) });

      if (result.deletedCount === 1) {
        console.log('Review removed successfully.');
      } else {
        throw new Error('Review not found. No review was removed.');
      }
    } catch (error) {
      if (error.message === 'Review not found. No review was removed.') {
        console.log(error.message);
      } else {
        console.error('Error occurred during review removal:', error);
        throw new Error('Failed to remove the review. Please try again later.');
      }
    }
  }

  static async modifyReview(props) {
    try {
      const db = getDB();

      // Check if the review exists
      const existingReview = await db.collection(this.collectionName).findOne({
        _id: new ObjectId(props._id),
      });

      if (!existingReview) {
        throw new Error('No review found. Cannot modify the review.');
      }

      // Check if the user is authorized to modify the review
      if (existingReview.user_id !== props.user_id) {
        throw new Error('You are not authorized to modify this review.');
      }

      const result = await db.collection(this.collectionName).updateOne(
        { _id: new ObjectId(props._id) },
        {
          $set: {
            rating: props.rate,
            body: props.body,
            modify: true,
            updated_at: new Date(),
          },
        }
      );

      if (result.modifiedCount !== 1) {
        throw new Error('Failed to modify the review. Please try again later.');
      }
    } catch (error) {
      console.error('Error occurred during review modification:', error);
      throw new Error('Failed to modify the review. Please try again later.');
    }
  }
}

module.exports = Reviews;
