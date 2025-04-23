// config/session.js

const session = require('express-session');

module.exports = session({
    secret: 'yourSuperSecretKey123', // change this to a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: false // set to true if using HTTPS
    }
});
