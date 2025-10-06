require('dotenv').config()
import { v2 as cloudinary } from 'cloudinary';

const CLOUD_NAME= process.env.CLOUDINAY_NAME
const API_KEY= process.env.CLOUDINAY_API_KEY
const API_SECRET= process.env.CLOUDINAY_API_SECRET


const cloudinary = cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET // Click 'View API Keys' above to copy your API secret
});


module.exports = cloudinary