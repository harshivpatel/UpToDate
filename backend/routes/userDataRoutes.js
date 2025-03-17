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
router.get('/UserId/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if(!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Invalid userId' });
        }
        const userData = await UserData.findOne({ userId });

        if(!userData) {
            return res.status(404).json({ error: 'User data not found' });
        }
        res.status(200).json(userData);
    } catch (err) {
        console.error('Erro fetching data:', err);
        res.status(500).json({ error: 'Failed to fetch data', details: err.message });
    }
});

// Update Data
router.put('/update/:userId', async (req, res) => {
    try {
        const { bookmarks, preferences } = req.body;
        const updateData = await UserData.findOneAndUpdate(
            { userId: req.params.userId },
            { bookmarks, preferences },
            { new: true }
        );
        if(!updateData) {
            return res.status(404).json({ error : ' User data not found '})
        }
        res.status(200).json({ message: 'Data updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update data' });
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
      console.error('Error deleting data:', err); // Log the error
      res.status(500).json({ error: 'Failed to delete data', details: err.message });
    }
  });;

module.exports = router;