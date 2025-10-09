const express= require('express')
const { isAdmin, isLogin } = require('../middleware/authenticator')
const { getImages, addImage, removeImage } = require('../controller/gallery.controller')



const galleryRouter= express.Router()


galleryRouter.get('/', getImages)
galleryRouter.post('/add',isLogin, isAdmin, addImage)
galleryRouter.delete('/delete',isLogin, isAdmin, removeImage)



module.exports= galleryRouter