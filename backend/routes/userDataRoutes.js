const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserData = require('../models/UserData');

// Add data
router.post('/add', async (req, res) => {
    try {
        const { userId, bookmarks, preferences } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid userId format. Expected ObjectId." });
        }
        const userData = new UserData({ 
            userId: new mongoose.Types.ObjectId(userId), 
            bookmarks, 
            preferences });
        await userData.save();

        res.status(201).json({ message: 'Data added successfully', data: userData });
    }
    catch(err) {
        console.log('Error adding data:', err);
        res.status(500).json({ error: 'Failed to add data', details: err.message });
    }
});

// Get Data
router.get('/userId/:userId', async (req, res) => {
    try {
        const userData = await UserData.findOne({ userId: req.params.userId });

        if (!userData) {
            return res.status(404).json({ error: 'User data not found' });
        }

        res.status(200).json(userData);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to fetch data', details: err.message });
    }
});

// Update Data
router.put('/update/:userId', async (req, res) => {
    try {
        const { bookmarks, preferences } = req.body;

        if (bookmarks === undefined && preferences === undefined) {
            return res.status(400).json({ error: 'At least one field (bookmarks or preferences) must be provided for update' });
        }
        const updateFields = {};
        if (bookmarks !== undefined) updateFields.bookmarks = bookmarks;
        if (preferences !== undefined) updateFields.preferences = preferences;

        const updateData = await UserData.findOneAndUpdate(
            { userId: req.params.userId },
            { $set: updateFields },
            { new: true}
        );
        if (!updateData) {
            return res.status(404).json({ error : ' User data not found '})
        }
        res.status(200).json({ message: 'Data updated successfully', data: updateData });
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ error: 'Failed to update data', details: err.message });
    }
});

// Delete data
router.delete('/delete/:userId', async (req, res) => {
    try {
      const deletedData = await UserData.findOneAndDelete({ userId: req.params.userId });

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