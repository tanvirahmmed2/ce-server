const express = require('express')
const cors = require('cors')
const userRouter = require('./router/user.router')


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




module.exports = app