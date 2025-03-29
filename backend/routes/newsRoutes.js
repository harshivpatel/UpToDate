const express = require('express');
const router = express.Router();
const axios = require('axios');

const NEWS_API_KEY = '241d9cda125a47f5a816a7fc8fa1cc0a';
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines?country=ie&apiKey=241d9cda125a47f5a816a7fc8fa1cc0a';

router.get('/', async (req, res) => {
    try {
        const { q, category, country } = req.query;
        const response = await axios.get(NEWS_API_URL, {
            params: {
                apiKey: NEWS_API_KEY,
                q: q || '',
                category: category || '',
                country: country || 'ie',
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

module.exports = router;