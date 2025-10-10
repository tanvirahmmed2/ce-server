const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },

    dateOfBirth: {
        type: Date,
        required: [true, 'Date of Birth is required']
    },
    profileImage: {
        type: String,
        default: null, // no image by default
        trim: true
    },
    profileImage_id: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'Gender is required']
    },
    bloodGroup: {
        type: String,
        required: [true, 'Blood Group is required']
    },

    country: {
        type: String,
        required: [true, 'Country name is required'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    isBanned:{
        type:Boolean,
        default: false
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },

    role: {
        type: String,
        enum: ['user','author','admin'],
        default: 'user'
    },
    education: [
        {
            degree: { type: String, trim: true },
            field: { type: String, trim: true },
            institution: { type: String, trim: true },
            startYear: { type: Number },
            endYear: { type: Number },
            grade: { type: String, trim: true }
        }
    ],
    publications: [
        {
            title: { type: String, trim: true },
            link: { type: String, trim: true },
            description: { type: String, trim: true },

        }
    ],
    passwordResetToken: {
        type: String,
        default: null,
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    } 
});

const User = mongoose.model('User', userSchema);
module.exports = User;
