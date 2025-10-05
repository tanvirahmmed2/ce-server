const mongoose= require('mongoose')


const eventSchema= new mongoose.Schema({
    title:{
        type:String,
        required: [true, 'Title is required'],
        trime:true,
    },
    description:{
        type:String,
        required: [true, 'Description is required'],
        trime:true,
    },
    location:{
        type:String,
        required: [true, 'Location is required'],
        trime:true,
    },

})


const Event= mongoose.model('events', eventSchema)