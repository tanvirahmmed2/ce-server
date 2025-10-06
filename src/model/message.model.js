const mongoose= require('mongoose')

const messageScehma= new mongoose.Schema({
    name:{
        type:String,
        required: [ true ,'Name is  required']
    },
    email:{
        type: String,
        required: [ true ,'email is  required'],
        trim: true
    },
    subject:{
        type: String,
        required: [ true ,'Subject is  required'],
        trim: true
    },
    message:{
        
        type: String,
        required: [ true ,'Subject is  required']
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

})


const Message= mongoose.model('messages', messageScehma)

module.exports= Message