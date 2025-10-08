const express= require('express')
const { getTeam, addTeam, removeTeam } = require('../controller/team.controller')
const upload = require('../config/multer')
const { isLogin, isAdmin } = require('../middleware/authenticator')

const teamRouter= express.Router()



teamRouter.get('/', getTeam)
teamRouter.post('/add', isLogin, isAdmin, upload.single('profileImage'),addTeam)
teamRouter.delete('/remove',isLogin, isAdmin, removeTeam)


module.exports= teamRouter