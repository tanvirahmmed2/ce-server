const cloudinary = require("../config/cloudinary");
const Notice = require("../model/notice.model");
const streamifier = require("streamifier");

const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find({});
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

        const uploadedPdf = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "notice", resource_type: "raw" }, 
                (error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        // Save notice to database
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

        // 1️⃣ Validate ID
        if (!id) {
            return res.status(400).send({
                success: false,
                message: "Notice ID is required",
            });
        }

        // 2️⃣ Check if notice exists
        const notice = await Notice.findById(id);
        if (!notice) {
            return res.status(404).send({
                success: false,
                message: "Notice not found",
            });
        }

        // 3️⃣ Delete PDF from Cloudinary (only if it exists)
        if (notice.pdf_id) {
            try {
                await cloudinary.uploader.destroy(notice.pdf_id);
            } catch (cloudError) {
                console.log("Cloudinary delete failed:", cloudError.message);
                // optional: continue even if pdf deletion fails
            }
        }

        // 4️⃣ Delete notice from MongoDB
        await Notice.findByIdAndDelete(id);

        // 5️⃣ Send response
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
