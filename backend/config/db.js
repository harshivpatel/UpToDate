const mongoose = require('mongoose');
// MongoDB connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// Database name
const dbName = 'UpToDate';

// Connect to the database
async function connectDB() {
    try {
        await mongoose.connect(`${uri}/${dbName}`);
            console.log('Connected to MongoDB'); 
    } catch (err) {
        console.error('Error connecting to MongoDB ', err);
        process.exit(1);
    }
}
module.exports = connectDB;
