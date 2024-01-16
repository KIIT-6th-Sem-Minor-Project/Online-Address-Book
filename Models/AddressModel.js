const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming a "User" model exists
        required: true // Ensure every address is linked to a user
    },
    addrIngName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true, // Remove leading/trailing spaces
        lowercase: true // Normalize email case
    },
    phone: {
        type: String,
        required: true
    },
    streetAddr: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    labels: [String], // Array to store multiple labels
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Mongoose model
const Address = mongoose.model('Address', addressSchema);

// Export the model for use in other files
module.exports = Address;