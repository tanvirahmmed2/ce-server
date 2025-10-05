const mongoose=require('mongoose')

const updateScehma= new mongoose.Schema({
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
    createdAt:{
        type: Date,
        default: Date.now
    }

})


const Update= mongoose.model('updates', updateScehma)

module.exports= Update