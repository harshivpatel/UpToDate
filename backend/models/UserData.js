const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  userName: { type: String, required: true },
  bookmarks: [{ type: [String], default: [] }],
  preferences: { 
    theme : { type: String, default: 'light' },
    language: { type: String, default: 'en' }
   },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserData', userDataSchema);