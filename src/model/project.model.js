const mongoose=require('mongoose')

const projectScehma= new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description:{
        type: String,
        required: [true, 'Description is required'],
    },
    image:{
        type: String,
        required: [true, 'Image is required'],
    },
    image_id:{
        type: String,
        required: [true, 'Image is required'],
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

})


const Project= mongoose.model('projects',projectScehma)

module.exports= Project