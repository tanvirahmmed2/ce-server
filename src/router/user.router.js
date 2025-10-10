const express = require('express')
const { resgisterUser, loginUser, logoutUser, getUsers, protectedRoute,  } = require('../controller/user.controller')
const {   isLogin } = require('../middleware/authenticator')
const userRouter = express.Router()



userRouter.get('/', (req, res) => {
    res.status(200).send('CCIRL user server is running')
})


userRouter.post('/register', resgisterUser)
userRouter.post('/login', loginUser)
userRouter.post('/logout',isLogin, logoutUser)
userRouter.get('/getusers',  getUsers)


userRouter.get('/protectedroute', isLogin, protectedRoute )



module.exports = userRouter