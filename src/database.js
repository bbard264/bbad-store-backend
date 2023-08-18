const { MongoClient } = require('mongodb');

// Connection URL
const url =
  'mongodb+srv://bbadBackEnd:HKcSyfUuCqnUzwwH@bbadstore.r6t7wpm.mongodb.net/';

// Database Name
const dbName = 'bbad';

// Create a new MongoClient
const client = new MongoClient(url);

// Connect to the MongoDB server
const connectToDB = async () => {
  try {
    await client.connect();
    console.log(`db connected!| name: "${dbName}"`);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};

const getDB = () => {
  return client.db(dbName);
};

module.exports = { connectToDB, getDB };
