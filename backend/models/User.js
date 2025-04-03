const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userName: { 
        type: String, 
        required: [true, "Username is required"], 
        unique: true, 
        minlength: [3, "Username must be at least 3 characters"], 
        maxlength: [12, "Username must not exceed 12 characters"]
    },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password: { 
        type: String, 
        required: [true, "Password is required"], 
        minlength: [6, "Password must be at least 6 characters"],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/, 
            "Password must have at least one uppercase letter, one lowercase letter, and one number"
        ]
    },
createdAt: { type: Date, default: Date.now },
});

// Method to compare hashed passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
