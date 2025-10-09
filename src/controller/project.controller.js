const cloudinary = require("../config/cloudinary")
const Project = require("../model/project.model")



const getProject = async (req, res) => {

    try {
        const projects = await Project.find({})
        if (!projects) {
            return res.status(400).send({
                success: false,
                message: 'No project found'
            })
        }
        res.status(201).send({
            success: true,
            message: 'project Fetch successfull',
            payload:projects
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'project fetch failed',
            error: error
        })
    }
}

const addProject = async (req, res) => {
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
        const uploadedImage = await cloudinary.uploader.upload(fileStr, { folder: 'project' })
        const newProject = new Project({
            title, description, image: uploadedImage.secure_url, image_id: uploadedImage.public_id
        })
        await newProject.save()
         res.status(200).send({
            success: true,
            message: 'Successfully added project'
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to add project',
            error: error
        })

    }

}

const removeProject = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Project id not found'
            })
        }
        const project = await Project.findOne({ _id: id })
        if (!project) {
            return res.status(400).send({
                success: false,
                message: 'Project not found'
            })
        }
        await cloudinary.uploader.destroy(project.image_id)
        await Project.findOneAndDelete({ _id: id })
        res.status(200).send({
            success: true,
            message: 'Successfully removed Project'
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to remove Project',
            error: error
        })
    }

}





module.exports = {
    getProject,
    addProject,
    removeProject
}