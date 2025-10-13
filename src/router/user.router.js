const express = require('express')
const { resgisterUser, loginUser, logoutUser, getUsers, protectedRoute, updateRole, updateBan, forgetPassword, resetPassword, deleteUser, addPublication,  removepubliaction, getPublications, updateName, updateDob, updateEmail, updatePassword, addEducation, removeEducation, addWork, removeWork,  } = require('../controller/user.controller')
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

// update

userRouter.post('/addpublication',isLogin, isAuthor, addPublication)
userRouter.delete('/removepublication',isLogin, isAuthor, removepubliaction)

userRouter.put('/updatename', updateName)
userRouter.put('/updatedob', updateDob)
userRouter.put('/updateemail', updateEmail)
userRouter.put('/updatepassword', updatePassword)
userRouter.post('/addeducation', addEducation)
userRouter.delete('/removeeducation', removeEducation)
userRouter.post('/addwork', addWork)
userRouter.delete('/removework', removeWork)

userRouter.get('/publications', getPublications)












module.exports = userRouter