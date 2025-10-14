const cloudinary = require("../config/cloudinary");
const Notice = require("../model/notice.model");

const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find({}).sort({ _id: -1 })
        if (!notices || notices.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No notices found"
            });
        }

        res.status(200).send({
            success: true,
            message: "Notices retrieved successfully",
            payload: notices
        });
    } catch (error) {
        console.error("Error fetching notices:", error);
        res.status(500).send({
            success: false,
            message: "Failed to fetch notices",
            error: error.message
        });
    }
};

const addNotice = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).send({
                success: false,
                message: "Title is required"
            });
        }

        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "PDF file is required"
            });
        }
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;


        const uploadedPdf = await cloudinary.uploader.upload(fileStr, {
            folder: 'notice',
            resource_type: 'raw',
        });


        const newNotice = new Notice({
            title,
            pdf: uploadedPdf.secure_url,
            pdf_id: uploadedPdf.public_id
        });

        await newNotice.save();

        return res.status(201).send({
            success: true,
            message: "Notice added successfully",
            data: newNotice
        });

    } catch (error) {
        console.error("Error adding notice:", error);
        return res.status(500).send({
            success: false,
            message: "Failed to add notice",
            error: error.message
        });
    }
};


const removeNotice = async (req, res) => {
    try {
        const { id } = req.body;


        if (!id) {
            return res.status(400).send({
                success: false,
                message: "Notice ID is required",
            });
        }


        const notice = await Notice.findById(id);
        if (!notice) {
            return res.status(404).send({
                success: false,
                message: "Notice not found",
            });
        }


        if (notice.pdf_id) {
            try {
                await cloudinary.uploader.destroy(notice.pdf_id, { resource_type: 'raw' });
            } catch (cloudError) {
                console.log("Cloudinary delete failed:", cloudError.message);

            }
        }


        await Notice.findByIdAndDelete(id);


        return res.status(200).send({
            success: true,
            message: "Notice deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting notice:", error);
        res.status(500).send({
            success: false,
            message: "Failed to delete notice",
            error: error.message,
        });
    }
};


module.exports = {
    getNotices,
    addNotice,
    removeNotice
};
