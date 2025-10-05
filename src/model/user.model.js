const mongoose= require('mongoose')

const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    }
})