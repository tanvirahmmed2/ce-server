const Update = require("../model/update.model")



const getUpdate = async (req, res) => {

    try {
        const updates = await Update.find({})
        if (!updates) {
            return res.status(400).send({
                success: false,
                message: 'No update found'
            })
        }
        res.status(201).send({
            success: true,
            message: 'Update Fetch successfull',
            payload: updates
        })
    } catch (error) {
        res.status(400).send({
                success: false,
                message: 'update fetch failed',
                error: error
            })
    }
}

const addUpdate= async(req,res)=>{

}

const removeUpdate=async(req,res)=>{

}
module.exports = {
    getUpdate,
    addUpdate,
    removeUpdate
}