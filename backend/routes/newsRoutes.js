const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;

        if(!apiKey) {
            return res.status(500).json({ error: 'Missing API Key' });
        }

        const url = `https://newsapi.org/v2/top-headlines?sources=the-times-of-india&apiKey=${apiKey}`;
        // console.log("Fetching news from:", url);

        const response = await axios.get(url);
        res.json(response.data);

    } catch (error) {
        console.log('Error fetching the news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

module.exports = router;
