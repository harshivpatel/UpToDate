const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookmarks: [{ type: String }],
    preferences: { type: Object, default: {}},
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserData', userDataSchema);