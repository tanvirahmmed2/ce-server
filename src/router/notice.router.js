const express= require('express')
const { getNotices } = require('../controller/notice.controller')



const noticeRouter= express.Router()


noticeRouter.get('/', getNotices)



module.exports= noticeRouter