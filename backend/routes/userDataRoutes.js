const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserData = require('../models/UserData');
const { isAuthenticated } = require('../middleware/sessionHandler');

// Add data
router.post('/add', isAuthenticated, async (req, res) => {
    try {
        const { bookmarks, preferences } = req.body;
        const userId = req.session.user.id;

        const userData = new UserData({
            userId: new mongoose.Types.ObjectId(userId),
            bookmarks,
            preferences
        });

        await userData.save();
        res.status(201).json({ message: 'Data added successfully', data: userData });
    } catch (err) {
        console.log('Error adding data:', err);
        res.status(500).json({ error: 'Failed to add data', details: err.message });
    }
});

// Get data
router.get('/me', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ error: 'User data not found' });
        }

        res.status(200).json(userData);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to fetch data', details: err.message });
    }
});

// Update data
router.put('/update', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { bookmarks, preferences } = req.body;

        if (bookmarks === undefined && preferences === undefined) {
            return res.status(400).json({ error: 'At least one field (bookmarks or preferences) must be provided for update' });
        }

        const updateFields = {};
        if (bookmarks !== undefined) updateFields.bookmarks = bookmarks;
        if (preferences !== undefined) updateFields.preferences = preferences;

        const updateData = await UserData.findOneAndUpdate(
            { userId },
            { $set: updateFields },
            { new: true }
        );

        if (!updateData) {
            return res.status(404).json({ error: 'User data not found' });
        }

        res.status(200).json({ message: 'Data updated successfully', data: updateData });
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ error: 'Failed to update data', details: err.message });
    }
});

// Delete data
router.delete('/delete', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const deletedData = await UserData.findOneAndDelete({ userId });

        if (!deletedData) {
            return res.status(404).json({ error: 'User data not found' });
        }

        res.status(200).json({ message: 'Data deleted successfully', data: deletedData });
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).json({ error: 'Failed to delete data', details: err.message });
    }
});

module.exports = router;
