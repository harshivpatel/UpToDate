const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment
dotenv.config();

// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/news', require('./routes/newsRoutes'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});