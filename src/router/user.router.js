const express = require('express')
const { resgisterUser } = require('../controller/user.controller')
const userRouter = express.Router()



userRouter.get('/', (req, res) => {
    res.status(200).send('CCIRL user server is running')
})


userRouter.post('/register', resgisterUser)



module.exports = userRouter