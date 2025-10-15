const express = require('express')
const { resgisterUser, loginUser, logoutUser, getUsers, protectedRoute, updateRole, updateBan, forgetPassword, resetPassword, deleteUser, addPublication,  removepubliaction, getPublications, updateName, updateDob,  updatePassword, addEducation, removeEducation, addWork, removeWork, updateProfileImage,  } = require('../controller/user.controller')
const {   isLogin, isAdmin, isAuthor } = require('../middleware/authenticator')
const upload = require('../config/multer')
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

userRouter.post('/addpublication',isLogin, isAuthor,upload.single('pdf'), addPublication)
userRouter.delete('/removepublication', removepubliaction)

userRouter.put('/updatename', updateName)
userRouter.put('/updatedob', updateDob)
userRouter.put('/updatepassword', updatePassword)
userRouter.post('/addeducation', addEducation)
userRouter.delete('/removeeducation', removeEducation)
userRouter.post('/addwork', addWork)
userRouter.delete('/removework', removeWork)
userRouter.put('/updateprofileimage', upload.single('file'), updateProfileImage)

userRouter.get('/publications', getPublications)












module.exports = userRouter