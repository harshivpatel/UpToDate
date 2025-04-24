const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');
const User = require('../models/User');

// Ensure UserData exists for a user
const ensureUserDataExists = async (userName, userId) => {
  if (!userName || !userId) {
    throw new Error('Missing userName or userId in session');
  }

  let userData = await UserData.findOne({ userName });
  if (!userData) {
    userData = new UserData({
      userId,
      userName,
      bookmarks: [],
      preferences: { theme: 'light', language: 'en' }
    });
    await userData.save();
  }
  return userData;
};

// Create UserData manually (optional API)
router.post('/add', async (req, res) => {
  try {
    const { userName, bookmarks = [], preferences = {} } = req.body;
    if (!userName) return res.status(400).json({ error: 'Username is required' });

    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existing = await UserData.findOne({ userName });
    if (existing) return res.status(400).json({ error: 'UserData already exists' });

    const newUserData = new UserData({ userId: user._id, userName, bookmarks, preferences });
    await newUserData.save();

    res.status(201).json({ message: 'UserData created', data: newUserData });
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
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch data', details: err.message });
  }
});

// Update bookmarks/preferences
router.put('/update/:userName', async (req, res) => {
  try {
    const { bookmarks, preferences } = req.body;
    const update = {};
    if (bookmarks !== undefined) update.bookmarks = bookmarks;
    if (preferences !== undefined) update.preferences = preferences;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    const updated = await UserData.findOneAndUpdate(
      { userName: req.params.userName },
      { $set: update },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'User data not found' });
    res.status(200).json({ message: 'Updated successfully', data: updated });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Delete user data
router.delete('/delete/:userName', async (req, res) => {
  try {
    const deleted = await UserData.findOneAndDelete({ userName: req.params.userName });
    if (!deleted) return res.status(404).json({ error: 'User data not found' });

    res.status(200).json({ message: 'Deleted successfully', data: deleted });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Add bookmark (session-based)
router.post('/bookmark', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { article } = req.body;
  if (!article || !article.url) return res.status(400).json({ error: 'Valid article required' });

  try {
    const userData = await ensureUserDataExists(user.userName, user.id);
    const exists = userData.bookmarks.some(b => b.url === article.url);
    if (!exists) {
      userData.bookmarks.push(article);
      await userData.save();
    }

    res.status(200).json({ message: 'Bookmark added', bookmarks: userData.bookmarks });
  } catch (err) {
    console.error('Bookmark error:', err);
    res.status(500).json({ error: 'Failed to save bookmark', details: err.message });
  }
});

// Get bookmarks (session-based)
router.get('/bookmarks', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const userData = await UserData.findOne({ userName: user.userName });
    if (!userData) return res.status(404).json({ error: 'User data not found' });

    res.status(200).json({ bookmarks: userData.bookmarks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks', details: err.message });
  }
});

// Remove bookmark (session-based)
router.post('/remove-bookmark', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { article } = req.body;
  if (!article || !article.url) return res.status(400).json({ error: 'Valid article required' });

  try {
    const userData = await ensureUserDataExists(user.userName, user.id);
    userData.bookmarks = userData.bookmarks.filter(b => b.url !== article.url);
    await userData.save();

    res.status(200).json({ message: 'Bookmark removed', bookmarks: userData.bookmarks });
  } catch (err) {
    console.error('Remove bookmark error:', err);
    res.status(500).json({ error: 'Failed to remove bookmark', details: err.message });
  }
});

module.exports = {
  router,
  ensureUserDataExists
};
