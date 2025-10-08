const Team = require("../model/team.model")



const getTeam=async(req, res)=>{
    const team= await Team.find({})
    if(!team){
        return res.status(400).send({
            success: false,
            message: 'Team data not available'
        })
    }
    res.status(200).send({
        success: true,
        message: 'Successfully fetched all team members',
        payload: team
    })
}


module.exports={
    getTeam
}