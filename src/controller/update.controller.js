const cloudinary = require("../config/cloudinary")
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

const addUpdate = async (req, res) => {
    try {
        const { title, description } = req.body
        if (!title || !description) {
            return res.status(400).send({
                success: false,
                message: 'All fields are required',
            })
        }
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: 'please upload image',
            })
        }
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const uploadedImage = await cloudinary.uploader.upload(fileStr, { folder: 'update' })
        const newUpdate = new Update({
            title, description, image: uploadedImage.secure_url, image_id: uploadedImage.public_id
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to add update',
            error: error
        })

    }

}

const removeUpdate = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Update id not found'
            })
        }
        const update = await Update.findOne({ _id: id })
        if (!update) {
            return res.status(400).send({
                success: false,
                message: 'Update not found'
            })
        }
        await cloudinary.uploader.destroy(update.image_id)
        await Update.findOneAndDelete({ _id: id })
        res.status(200).send({
            success: true,
            message: 'Successfully removed update'
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to remove update',
            error: error
        })
    }

}
module.exports = {
    getUpdate,
    addUpdate,
    removeUpdate
}