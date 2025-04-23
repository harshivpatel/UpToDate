// middleware/sessionHandler.js

function setSession(req, userData) {
    req.session.user = {
        id: userData._id,
        userName: userData.userName,
        email: userData.email
    };
}

function getSessionUser(req) {
    return req.session.user;
}

function destroySession(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.clearCookie('connect.sid'); // name of default session cookie
        res.send('Logged out successfully');
    });
}

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    return res.status(401).send('Unauthorized: Please log in');
}

module.exports = {
    setSession,
    getSessionUser,
    destroySession,
    isAuthenticated
};
