const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = process.env.MONGODB-URI || 'mongodb://localhost;27017';

// Database name
const dbName = 'UpToDate';

// Create a new MongoClient
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

// Connect to the database
async function connectDB() {
    try {
        await client.connectDB();
        console.log('Connected to MongoDB');
        return client.db(dbName);
    } catch (err) {
        console.error('Error connecting to MongoDB ', err);
        process.exit(1);
    }
}
module.exports = connectDB;
