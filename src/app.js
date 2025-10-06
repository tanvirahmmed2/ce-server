const express = require('express')
const cors = require('cors')
const userRouter = require('./router/user.router')
const messageRouter = require('./router/message.router')
const eventRouter = require('./router/event.router')
const libraryRouter = require('./router/library.router')
const noticeRouter = require('./router/notice.router')
const updateRouter = require('./router/update.router')


const app = express()



app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))





app.get('/api', (req,res)=>{
    res.status(200).send('CCIRL server is running')
})


app.use('/api/user', userRouter)
app.use('/api/message', messageRouter)
app.use('/api/event', eventRouter)
app.use('/api/library', libraryRouter)
app.use('/api/notice', noticeRouter)
app.use('/api/update', updateRouter)




module.exports = app