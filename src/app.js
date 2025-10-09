const express = require('express')
const cors = require('cors')

const cookieParser = require('cookie-parser');
const userRouter = require('./router/user.router')
const messageRouter = require('./router/message.router')
const eventRouter = require('./router/event.router')
const libraryRouter = require('./router/library.router')
const noticeRouter = require('./router/notice.router')
const updateRouter = require('./router/update.router');
const teamRouter = require('./router/team.router');
const projectRouter = require('./router/project.router');
const galleryRouter = require('./router/gallery.router');


const app = express()



app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
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
app.use('/api/team', teamRouter)
app.use('/api/project', projectRouter)
app.use('/api/gallery', galleryRouter)




module.exports = app