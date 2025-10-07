const Notice = require("../model/notice.model")


const getNotices=async(req,res)=>{
    const notices= await Notice.find({})
    if(!notices){
        return res.status(400).send({
            success: false,
            message: 'Not not found'
        })
    }
    res.status(200).send({
        success:true,
        message: 'Notice found successfully',
        payload: notices
    })
}



module.exports={
    getNotices
}