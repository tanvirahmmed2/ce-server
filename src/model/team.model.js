const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    post: {
        type: String,
        required: true,
        trim: true,
    },
    profileImage: {
        type: String,
        required: true,
    },
    profileImage_id: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})


const Team= mongoose.model('team', teamSchema)

module.exports= Team