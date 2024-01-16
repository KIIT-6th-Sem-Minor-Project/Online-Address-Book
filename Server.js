const express = require('express');
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser');
// const { getDb } = require('./MongoConnect');
require('./MongoConnect')
const Address = require('./Models/AddressModel')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors())
app.use(helmet())

// API endpoints for address operations
app.post('/addresses', async (req, res) => {
    try {
        console.log("Request body:", req.body);

        // Extract address fields
        const {
            user,
            addrIngName,
            firstName,
            lastName,
            email,
            phone,
            streetAddr,
            postalCode,
            city,
            country,
            labels
        } = req.body;

        // Validate required fields
        if (!user || !addrIngName || !firstName || !lastName || !email || !phone || !streetAddr || !postalCode || !city || !country) {
            return res.status(400).json({ error: "Please fill in all required fields." });
        }

        // Check for existing address with same user and street address (adjust criteria as needed)
        const existingAddress = await Address.findOne({ user, streetAddr });
        if (existingAddress) {
            return res.status(400).json({ error: "Address already exists for this user." });
        }

        // Optional: Handle profile picture upload (if applicable)
        // ...

        const newAddress = new Address({
            user,
            addrIngName,
            firstName,
            lastName,
            email,
            phone,
            streetAddr,
            postalCode,
            city,
            country,
            labels,
            // Add any other fields from your Address model
        });

        await newAddress.save();
        console.log("New address added:", newAddress);
        res.status(201).json(newAddress);
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ error: "An error occurred. Please try again later." });
    }
});


app.get('/addresses', async (req, res) => {
    try {
        const addresses = await Address.find(); // Retrieve all addresses
        res.json(addresses); // Send the addresses as a JSON response
    } catch (error) {
        console.error("Error retrieving addresses:", error);
        res.status(500).json({ error: "An error occurred. Please try again later." });
    }
});

app.put('/addresses/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract address ID from request parameters

        // Validate required fields (adjust as needed)
        if (!req.body.user || !req.body.addrIngName || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.phone || !req.body.streetAddr || !req.body.postalCode || !req.body.city || !req.body.country) {
            return res.status(400).json({ error: "Please fill in all required fields." });
        }

        const existingAddress = await Address.findById(id);

        if (!existingAddress) {
            return res.status(404).json({ error: "Address not found." });
        }

        // Update address fields
        existingAddress.user = req.body.user;
        existingAddress.addrIngName = req.body.addrIngName;
        existingAddress.firstName = req.body.firstName;
        existingAddress.lastName = req.body.lastName;
        existingAddress.email = req.body.email;
        existingAddress.phone = req.body.phone;
        existingAddress.streetAddr = req.body.streetAddr;
        existingAddress.postalCode = req.body.postalCode;
        existingAddress.city = req.body.city;
        existingAddress.country = req.body.country;
        existingAddress.labels = req.body.labels; // Assuming this is an array or object

        await existingAddress.save();
        console.log("Address updated:", existingAddress);
        res.json(existingAddress);
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(400).json({ error: "Failed to update address." });
    }
});


app.delete('/addresses/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract address ID from request parameters

        const existingAddress = await Address.findById(id);

        if (!existingAddress) {
            return res.status(404).json({ error: "Address not found." });
        }

        await Address.deleteOne({ _id: existingAddress._id });
 // Delete the address from the database

        console.log("Address deleted:", existingAddress);
        res.json({ message: "Address deleted successfully." });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ error: "Failed to delete address." });
    }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
