const express = require('express');
const router = express.Router();

router.get('/check-session', (req, res) => {
    console.log('Checking session...');
    res.json({
        message: req.session.user ? '✅ Session is active' : '❌ No session found',
        session: req.session
    });
});

module.exports = router;
