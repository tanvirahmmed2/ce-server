const express = require('express')
const { resgisterUser, loginUser, logoutUser, getUsers, protectedRoute, updateRole, updateBan, forgetPassword, resetPassword, deleteUser, addPublication,  removepubliaction, getPublications,  } = require('../controller/user.controller')
const {   isLogin, isAdmin, isAuthor } = require('../middleware/authenticator')
const userRouter = express.Router()



userRouter.get('/', (req, res) => {
    res.status(200).send('CCIRL user server is running')
})


userRouter.get('/users',  getUsers)
userRouter.post('/register', resgisterUser)
userRouter.post('/login', loginUser)
userRouter.post('/logout',isLogin, logoutUser)
userRouter.post('/forget', forgetPassword)
userRouter.post('/reset', resetPassword)
userRouter.delete('/delete', deleteUser)

userRouter.put('/updaterole',isLogin, isAdmin, updateRole)
userRouter.put('/updateban', updateBan)


userRouter.get('/protectedroute', isLogin, protectedRoute )



userRouter.post('/addpublication',isLogin, isAuthor, addPublication)
userRouter.delete('/removepublication',isLogin, isAuthor, removepubliaction)

userRouter.get('/publications', getPublications)

module.exports = userRouter