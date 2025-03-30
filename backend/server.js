require('dotenv').config({ path: './.env' });

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const session = require('express-session');

// Create an Express app
const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Session Middleware
app.use(session ({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', require('./routes/userRoutes')); // User routes (registration, login, etc.)
app.use('/api/userdatas', require('./routes/userDataRoutes')); // UserData routes (bookmarks, preferences, etc.)
app.use('/api/news', require('./routes/newsRoutes')); // News routes

// Render the index page
app.get('/', (req, res) => {
    res.render('index', { username: 'Virat Kohli'});
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});