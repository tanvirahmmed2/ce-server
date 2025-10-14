const Collab = require("../model/collab.model")
const cloudinary =require('../config/cloudinary')


const getCollabs = async (req, res) => {
    try {
        const collabs = await Collab.find({}).sort({ _id: -1 })
        if (!collabs) {
            return res.status(400).send({
                success: false,
                message: 'no collaboration data found'
            })
        }
        res.status(200).send({
            success: true,
            message: 'Collabs data fetched successfully',
            payload: collabs
        })
    } catch (error) {
        res.status(500).send({
            sucees: false,
            message: 'Collabs data fetching failed',
            error: error
        })

    }

}


const addCollab = async (req, res) => {
    try {
        const { title, portfolio } = req.body
        if (!title || !portfolio) {
            return res.status(400).send({
                success: false,
                message: 'All fields are required'
            })
        }
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: 'Logo/Image not found'
            })
        }


        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const uploadedImage = await cloudinary.uploader.upload(fileStr, { folder: 'collaboration' })

        const newCollab = new Collab({ title, image: uploadedImage.secure_url, image_id: uploadedImage.public_id, portfolio })
        await newCollab.save()
        res.status(200).send({
            success: true,
            message: 'Succesfully created Collaboration',
            payload: newEvent
        })
    } catch (error) {
        res.status(500).send({
            sucees: false,
            message: 'Collaboration creation failed',
            error: error
        })
    }
}



const deleteCollab = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(404).send({
                success: false,
                message: "Collaboration id not found"
            });
        }
        const collbData= await Collab.findById(id)
        if(!collbData){
            return res.status(404).send({
                success: false,
                message: "Collaboration data not found"
            });
        }
        await cloudinary.uploader.destroy(collbData.image_id)
        await Collab.findOneAndDelete({ _id: id })
        res.status(200).send({
            success: true,
            message: "Collaboration data deleted successfully",
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to delete collaboration data",
            error: error.message
        })
    }
}

module.exports = {
    getCollabs,
    addCollab,
    deleteCollab
}