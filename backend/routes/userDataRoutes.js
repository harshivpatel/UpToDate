const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');

// Add data
router.post('/add', async (req, res) => {
    try {
        const { userId, bookmarks, preferences } = req.body;
        const userData = new UserData({ userId, bookmarks, preferences });
        await userData.save();
        res.status(201).json({ message: 'Data added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add data' });
    }
});

// Get Data
router.get('/UserId', async(req, res) => {
    try {
        const userData = await UserData.findOne({ userId: req.params.userId });
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Update Data
router.put('/update/:userId', async (req, res) => {
    try {
        const { bookmarks, preferences } = req.body;
        await UserData.findOneAndUpdate(
            { userId: req.params.userId },
            { bookmarks, preferences },
            { new: true }
        );
        res.status(200).json({ message: 'Data updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update data' });
    }
});

// Delete data
router.delete('/delete/:userId', async (req, res) => {
    try {
        await userData.findOneAndDelete({ userId: req.params.userId });
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete data' });
    }
});

module.exports = router;