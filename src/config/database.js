require('dotenv').config()
const mongoose = require('mongoose')


const MONGO_URI=process.env.MONGO_URI

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected to mongoDB`)
    } catch (error) {
        console.log(`Couldn't connect to mongoDB`)
        console.log(error)
    }
}

module.exports = connectDB