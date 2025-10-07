const express= require('express')
const { getEvents, addEvent, deleteEvent } = require('../controller/event.controller')
const { isAdmin, isLogin } = require('../middleware/authenticator')



const eventRouter= express.Router()


eventRouter.get('/', getEvents)
eventRouter.post('/add',isLogin, isAdmin, addEvent)
eventRouter.delete('/delete',isLogin, isAdmin, deleteEvent)



module.exports= eventRouter