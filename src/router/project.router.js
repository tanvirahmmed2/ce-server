const express= require('express')
const upload = require('../config/multer')
const { isLogin, isAdmin } = require('../middleware/authenticator')
const { getProject,  addProject, removeProject, updateProject } = require('../controller/project.controller')



const projectRouter= express.Router()

projectRouter.get('/', getProject)
projectRouter.post('/add',isLogin, isAdmin, upload.single('image'), addProject)
projectRouter.delete('/remove', isLogin, isAdmin, removeProject)
projectRouter.put('/update', isLogin, isAdmin,updateProject)

module.exports= projectRouter