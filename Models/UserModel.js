const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Enforce unique emails for user accounts
    trim: true, // Remove extra whitespace
    lowercase: true // Normalize email to lowercase for consistency
  },
  password: {
    type: String,
    required: true,
    minlength: 8 // Enforce minimum password length for security
  },
  // Add other fields as needed, e.g., name, profile picture, etc.
});

module.exports = mongoose.model('User', userSchema);
