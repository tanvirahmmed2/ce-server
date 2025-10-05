const express = require('express')
const cors = require('cors')



app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))



const app = express()







module.exports = app