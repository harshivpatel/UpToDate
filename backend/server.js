require('dotenv').config({ path: './.env' });

const session = require('express-session');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

// Create an Express app
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
  }));
app.use(bodyParser.json());
app.use(cookieParser());

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true if using HTTPS
      sameSite: 'Lax',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    }
  }));

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', require('./routes/userRoutes')); 
app.use('/api/userdata', require('./routes/userDataRoutes'));
app.use('/api/news', require('./routes/newsRoutes')); 

// Render the index page
app.get('/', (req, res) => {
    res.render('index', { username: 'Virat Kohli' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🌍 Access API at: http://localhost:${PORT}/api/news`);
});
