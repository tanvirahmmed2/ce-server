const express= require('express')
const { isAdmin, isLogin } = require('../middleware/authenticator')
const { deleteCollab, addCollab, getCollabs } = require('../controller/collab.controller')
const upload = require('../config/multer')



const collabRouter= express.Router()


collabRouter.get('/', getCollabs)
collabRouter.post('/add',isLogin, isAdmin, upload.single('image'), addCollab)
collabRouter.delete('/delete',isLogin, isAdmin, deleteCollab)



module.exports= collabRouter