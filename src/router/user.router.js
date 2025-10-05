const express= require('express')
const userRouter= express.Router()



userRouter.get('/',(req,res)=>{
    res.status(200).send('CCIRL user server is running')
})



module.exports= userRouter