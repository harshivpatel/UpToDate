const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Change to String
  bookmarks: [{ type: String, default: [] }],
  preferences: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserData', userDataSchema);