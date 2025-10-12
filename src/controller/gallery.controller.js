const cloudinary = require("../config/cloudinary")
const Gallery = require("../model/gallery.model")



const getImages = async (req, res) => {

    try {
        const images = await Gallery.find({}).sort({ _id: -1 })
        if (!images) {
            return res.status(400).send({
                success: false,
                message: 'No image found'
            })
        }
        res.status(201).send({
            success: true,
            message: 'Image Fetch successfull',
            payload: images
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Image fetch failed',
            error: error
        })
    }
}

const addImage = async (req, res) => {
    try {
        const { title, author } = req.body
        if (!title || !author) {
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
        const uploadedImage = await cloudinary.uploader.upload(fileStr, { folder: 'gallery' })
        const newImage = new Gallery({
            title, author, image: uploadedImage.secure_url, image_id: uploadedImage.public_id
        })
        await newImage.save()
         res.status(200).send({
            success: true,
            message: 'Successfully added Image'
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to add Image',
            error: error
        })

    }

}

const removeImage = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: 'Image id not found'
      });
    }

    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).send({
        success: false,
        message: 'Image not found'
      });
    }

    await cloudinary.uploader.destroy(image.image_id, { resource_type: "image" }); 

    await Gallery.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: 'Successfully removed image'
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Failed to remove image',
      error: error.message
    });
  }
};



module.exports = {
    getImages,
    addImage,
    removeImage
}