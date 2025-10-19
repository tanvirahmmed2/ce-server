require('dotenv').config()
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
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: "PDF file is required" });
    }

    const fileStr = `data:application/pdf;base64,${req.file.buffer.toString("base64")}`;

    const publicIdWithExtension = req.file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    const result = await cloudinary.uploader.upload(fileStr, {
      resource_type: "raw", // CRITICAL: Treat PDF as a raw file
      folder: "notice",
      public_id: publicIdWithExtension, 
      unique_filename: false,
      overwrite: true,
    });
    
    if (!result || !result.public_id) {
        throw new Error("Cloudinary upload failed: Missing public ID in result.");
    }

    const pdfViewUrl = cloudinary.url(result.public_id, {
        resource_type: "raw",
        secure: true 
    });
    
    const newNotice = new Notice({
      title,
      pdf: pdfViewUrl, // The correct viewing URL is saved
      pdf_id: result.public_id, // The unique Cloudinary ID is saved
    });

    await newNotice.save();

    return res.status(201).json({
      success: true,
      message: "Notice added successfully",
    });
    
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Failed to add notice",
      error: error.message,
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
