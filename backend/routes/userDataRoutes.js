const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');
const User = require('../models/User');
const auth = require('../middleware/auth');


const ensureUserDataExists = async (userName, userId) => {
  if (!userName || !userId) {
    throw new Error('Missing userName or userId in token payload');
  }

  let userData = await UserData.findOne({ userName });
  if (!userData) {
    userData = new UserData({
      userId,
      userName,
      bookmarks: [],
      preferences: {}
    });
    await userData.save();
  }
  return userData;
};

router.post('/add', async (req, res) => {
  try {
    const { userName, bookmarks = [], preferences = {} } = req.body;

    if (!userName) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existingData = await UserData.findOne({ userName });
    if (existingData) return res.status(400).json({ error: 'UserData already exists' });

    const userData = new UserData({ userId: user._id, userName, bookmarks, preferences });
    await userData.save();

    res.status(201).json({ message: 'UserData created', data: userData });
  } catch (err) {
    console.error('Add UserData error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Get user data by username
router.get('/userName/:userName', async (req, res) => {
  try {
    const userData = await UserData.findOne({ userName: req.params.userName });
    if (!userData) return res.status(404).json({ error: 'User data not found' });

    res.status(200).json(userData);
  } catch (err) {
    console.error('Fetch UserData error:', err);
    res.status(500).json({ error: 'Failed to fetch data', details: err.message });
  }
});

// Update bookmarks/preferences
router.put('/update/:userName', async (req, res) => {
  try {
    const { bookmarks, preferences } = req.body;
    const updateFields = {};

    if (bookmarks !== undefined) updateFields.bookmarks = bookmarks;
    if (preferences !== undefined) updateFields.preferences = preferences;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    const updateData = await UserData.findOneAndUpdate(
      { userName: req.params.userName },
      { $set: updateFields },
      { new: true }
    );

    if (!updateData) return res.status(404).json({ error: 'User data not found' });

    res.status(200).json({ message: 'Data updated successfully', data: updateData });
  } catch (err) {
    console.error('Update UserData error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Delete user data
router.delete('/delete/:userName', async (req, res) => {
  try {
    const deleted = await UserData.findOneAndDelete({ userName: req.params.userName });
    if (!deleted) return res.status(404).json({ error: 'User data not found' });

    res.status(200).json({ message: 'UserData deleted', data: deleted });
  } catch (err) {
    console.error('Delete UserData error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Add bookmark (auth required)
router.post('/bookmark', auth, async (req, res) => {
  const { article } = req.body;
  const userName = req.user.userName;
  const userId = req.user.id;

  if (!article || !article.url) {
    return res.status(400).json({ error: 'Valid article required' });
  }

  try {
    const userData = await ensureUserDataExists(userName, userId);

    const alreadyExists = userData.bookmarks.some(b => b.url === article.url);
    if (!alreadyExists) {
      userData.bookmarks.push(article);
      await userData.save();
    }

    res.status(200).json({ message: 'Bookmark added', bookmarks: userData.bookmarks });
  } catch (err) {
    console.error('Bookmark error:', err);
    res.status(500).json({ error: 'Failed to save bookmark', details: err.message });
  }
});

// Get Bookmark
router.get('/bookmarks', auth, async (req, res) => {
  const userName = req.user.userName;

  try {
    const userData = await UserData.findOne({ userName });
    if (!userData) return res.status(404).json({ error: 'User data not found' });

    res.status(200).json({ bookmarks: userData.bookmarks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks', details: err.message });
  }
});


// Remove bookmark (auth required)
router.post('/remove-bookmark', auth, async (req, res) => {
  const { article } = req.body;
  const userName = req.user.userName;
  const userId = req.user.id;

  if (!article || !article.url) {
    return res.status(400).json({ error: 'Valid article required' });
  }

  try {
    const userData = await ensureUserDataExists(userName, userId);

    userData.bookmarks = userData.bookmarks.filter(item => item.url !== article.url);
    await userData.save();

    res.status(200).json({ message: 'Bookmark removed', bookmarks: userData.bookmarks });
  } catch (err) {
    console.error('Remove bookmark error:', err);
    res.status(500).json({ error: 'Failed to remove bookmark', details: err.message });
  }
});

module.exports = router;
