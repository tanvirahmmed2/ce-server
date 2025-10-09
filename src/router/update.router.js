const express= require('express')
const { getUpdate, addUpdate, removeUpdate } = require('../controller/update.controller')
const upload = require('../config/multer')



const updateRouter= express.Router()


updateRouter.get('/', getUpdate)
updateRouter.post('/add', upload.single('image'), addUpdate)
updateRouter.delete('/remove', removeUpdate)


module.exports= updateRouter