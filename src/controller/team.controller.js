const Team = require("../model/team.model")
const cloudinary = require('../config/cloudinary')
const User = require("../model/user.model")


const getTeam = async (req, res) => {
    try {
        const team = await Team.find({})
        if (!team) {
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
    } catch (error) {
        res.status(500).send({
            succes: false,
            message: "Failed to get team",
            error: error
        })
    }
}


const addTeam = async (req, res) => {
    try {
        const { name, role, post, email } = req.body
        if (!name || !role || !post || !email) {
            return res.status(200).send({
                success: false,
                message: 'Fill all field'
            })
        }
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: 'Profile image required'
            })
        }
        const user= await User.findOne({email:email})
        if(!user){
            return res.status(400).send({
                success: false,
                message: 'Member profile not found. Please create a profile first'
            })
        }

        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const uploadImage = await cloudinary.uploader.upload(fileStr, { folder: 'team' })

        const newTeam = new Team({
            name, role, post, profileImage: uploadImage.secure_url, profileImage_id: uploadImage.public_id, userId: user._id
        })
        await newTeam.save()
        res.status(200).send({
            success: true,
            message: 'Team member profile uploaded'
        })

    } catch (error) {
        res.status(500).send({
            succes: false,
            message: "Failed to add team member",
            error: error
        })
    }
}


const removeTeam=async(req,res)=>{
    try {
        const {id}= req.body
        if(!id){
            return res.status(400).send({
                success: false,
                message: 'Team member id not available'
            })
        }
        const member= await Team.findOne({_id:id})
        if(!member){
            return res.status(400).send({
                success: false,
                message: 'Team member not available'
            })
        }
        await cloudinary.uploader.destroy(member.profileImage_id)
        await Team.findOneAndDelete({_id: id})
        res.status(200).send({
            success:true,
            message: 'Successfully removed member'
        })


    } catch (error) {
        res.status(500).send({
            succes: false,
            message: "Failed to remove from team",
            error: error
        })
    }
}



module.exports = {
    getTeam,
    addTeam,
    removeTeam
}