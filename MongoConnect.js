const mongoose = require('mongoose')
const UserModel = require('./Models/UserModel')
require('dotenv').config();

const MONGO_URL = process.env.MONGODB_URI;
if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

const connect = async () => {

    const con = await mongoose.connect(MONGO_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        dbName: "Users"
    })
}

console.log(MONGO_URL);

mongoose.connection.once('open', () => {
    console.log("Connection Ready!")
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

connect()

module.exports = UserModel.connect

// async function getDb() {
//     try {
//         await client.connect(); // Connect within the async function
//         const db = client.db();
//         return db;
//     } catch (error) {
//         console.error(error);
//         throw error; // Re-throw the error for proper handling
//     }
// }

// module.exports = { getDb };
