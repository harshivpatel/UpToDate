const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserData = require('../models/UserData');
const User = require('../models/User');

// Add data
router.post('/add', async (req, res) => {
    try {
        const { userName, bookmarks, preferences } = req.body;

        if (!userName) {
            return res.status(400).json({ error: 'Username is required' });
        }
        const user = await User.findOne({ userName });

        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userData = new UserData({ 
            userId: user._id,
            userName, 
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
router.get('/userName/:userName', async (req, res) => {
    try {
        const userData = await UserData.findOne({ userName: req.params.userName });

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
router.put('/update/:userName', async (req, res) => {
    try {
        const { bookmarks, preferences } = req.body;

        if (bookmarks === undefined && preferences === undefined) {
            return res.status(400).json({ error: 'At least one field (bookmarks or preferences) must be provided for update' });
        }
        const updateFields = {};
        if (bookmarks !== undefined) updateFields.bookmarks = bookmarks;
        if (preferences !== undefined) updateFields.preferences = preferences;

        const updateData = await UserData.findOneAndUpdate(
            { userName: req.params.userName },
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
router.delete('/delete/:userName', async (req, res) => {
    try {
      const deletedData = await UserData.findOneAndDelete({ userName: req.params.userName });

      if (!deletedData) {
        return res.status(404).json({ error: 'User data not found' });
      }

      res.status(200).json({ message: 'Data deleted successfully', data: deletedData });
    } catch (err) {
      console.error('Error deleting data:', err); 
      res.status(500).json({ error: 'Failed to delete data', details: err.message });
    }
  });

  // Add bookmark
router.post('/bookmark', async (req, res) => {
    const { userName, article } = req.body;
  
    if (!userName || !article) {
      return res.status(400).json({ error: 'User name and article are required' });
    }
  
    try {
      const userData = await UserData.findOne({ userName });
  
      if (!userData) {
        return res.status(404).json({ error: 'User Data not found' });
      }
  
      const alreadyExists = userData.bookmarks.some(b => b.url === article.url);
  
      if (!alreadyExists) {
        userData.bookmarks.push(article);
        await userData.save();
      }
  
      res.status(200).json({ message: 'Bookmark added', bookmarks: userData.bookmarks });
    } catch (err) {
      console.error('Error saving the bookmark:', err);
      res.status(500).json({ error: 'Server error while bookmarking' });
    }
  });

  // Remove bookmark
router.post('/remove-bookmark', async (req, res) => {
    const { userName, article } = req.body;
  
    if (!userName || !article) {
      return res.status(400).json({ error: 'User name and article are required' });
    }
  
    try {
      const userData = await UserData.findOne({ userName });
  
      if (!userData) {
        return res.status(404).json({ error: 'User data not found' });
      }
  
      userData.bookmarks = userData.bookmarks.filter(item => item.url !== article.url);
      await userData.save();
  
      res.status(200).json({ message: 'Bookmark removed', bookmarks: userData.bookmarks });
    } catch (err) {
      console.error('Error removing the bookmark:', err);
      res.status(500).json({ error: 'Server error while removing the bookmark' });
    }
  });
  

module.exports = router;