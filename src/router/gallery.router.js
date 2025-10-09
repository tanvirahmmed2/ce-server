const express= require('express')
const { isAdmin, isLogin } = require('../middleware/authenticator')
const { getImages, addImage, removeImage } = require('../controller/gallery.controller')
const upload = require('../config/multer')



const galleryRouter= express.Router()


galleryRouter.get('/', getImages)
galleryRouter.post('/add', isLogin, isAdmin, upload.single('image'), addImage)
galleryRouter.delete('/delete',isLogin, isAdmin, removeImage)



module.exports= galleryRouter