const express= require('express')
const { getUpdate, addUpdate, removeUpdate } = require('../controller/update.controller')



const updateRouter= express.Router()


updateRouter.get('/', getUpdate)
updateRouter.post('/add', addUpdate)
updateRouter.delete('/remove', removeUpdate)


module.exports= updateRouter