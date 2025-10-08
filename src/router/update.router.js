const express= require('express')
const { getUpdate, addUpdate } = require('../controller/update.controller')



const updateRouter= express.Router()


updateRouter.get('/', getUpdate)
updateRouter.post('/add', addUpdate)


module.exports= updateRouter