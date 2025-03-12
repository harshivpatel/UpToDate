const express = require('express');
const router = express.Router();

// Example route to fetch news
router.get('/', (req, res) => {
    res.json({ message: 'Fetching news Articles' });
});

module.exports = router;