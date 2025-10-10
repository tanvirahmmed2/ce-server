const express = require('express')
const { resgisterUser, loginUser, logoutUser, getUsers, protectedRoute, updateRole, updateBan, forgetPassword,  } = require('../controller/user.controller')
const {   isLogin, isAdmin } = require('../middleware/authenticator')
const userRouter = express.Router()



userRouter.get('/', (req, res) => {
    res.status(200).send('CCIRL user server is running')
})


userRouter.get('/users',  getUsers)
userRouter.post('/register', resgisterUser)
userRouter.post('/login', loginUser)
userRouter.post('/logout',isLogin, logoutUser)
userRouter.post('/forget', forgetPassword)

userRouter.put('/updaterole',isLogin, isAdmin, updateRole)
userRouter.put('/updateban', updateBan)


userRouter.get('/protectedroute', isLogin, protectedRoute )



module.exports = userRouter