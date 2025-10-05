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

    gender: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'Gender is required']
    },

    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
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
        enum: ['member', 'author', 'admin'],
        default: 'member'
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
            link: { type: String, trim: true }
        }
    ],
    accountCreatedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
