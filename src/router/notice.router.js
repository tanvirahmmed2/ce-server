const express= require('express')
const { getNotices, addNotice, removeNotice } = require('../controller/notice.controller')
const upload = require('../config/multer')



const noticeRouter= express.Router()


noticeRouter.get('/', getNotices)
noticeRouter.post('/add', upload.single('pdf') ,addNotice)
noticeRouter.delete('/delete', removeNotice)



module.exports= noticeRouter