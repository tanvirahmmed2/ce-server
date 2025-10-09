const mongoose=require('mongoose')

const galleryScehma= new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    author:{
        type: String,
        required: [true, 'Author is required'],
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


const Gallery= mongoose.model('gallery', galleryScehma)

module.exports= Gallery