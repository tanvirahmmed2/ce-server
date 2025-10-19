const express= require('express')
const { getNotices, addNotice, removeNotice } = require('../controller/notice.controller')
const { isLogin, isAdmin } = require('../middleware/authenticator')
const upload = require('../config/multer')



const noticeRouter= express.Router()


noticeRouter.get('/', getNotices)
noticeRouter.post('/add', isLogin, isAdmin, upload.single('pdf') ,addNotice)
noticeRouter.delete('/delete', isLogin, isAdmin, removeNotice)



module.exports= noticeRouter