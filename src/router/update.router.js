const express= require('express')
const { getUpdate, addUpdate, removeUpdate } = require('../controller/update.controller')
const upload = require('../config/multer')
const { isLogin, isAdmin } = require('../middleware/authenticator')



const updateRouter= express.Router()


updateRouter.get('/', getUpdate)
updateRouter.post('/add',isLogin, isAdmin, upload.single('image'), addUpdate)
updateRouter.delete('/remove', isLogin, isAdmin, removeUpdate)


module.exports= updateRouter