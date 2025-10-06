const express= require('express')
const { getMessages, sendMessage, deleteMessage } = require('../controller/message.controller')



const messageRouter= express.Router()


messageRouter.get('/', getMessages)
messageRouter.post('/send', sendMessage)
messageRouter.delete('/delete', deleteMessage)




module.exports= messageRouter