require('dotenv').config()
const User = require("../model/user.model");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        if (!users) {
            return res.status(400).send({
                success: false,
                message: "No user found"
            })
        }
        res.status(200).send({
            success: true,
            message: "Successfully found users",
            payload: users
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error
        })
    }
}

const resgisterUser = async (req, res) => {
    try {
        const { name, dateOfBirth, gender, country, bloodGroup, phone, email, password } = req.body
        if (!name || !dateOfBirth || !gender || !country || !bloodGroup || !phone || !email || !password) {
            return res.status(400).send({
                success: false,
                message: 'All fields are required'
            });
        }
        const existUser = await User.findOne({ email: email })
        if (existUser) {
            return res.status(400).send({
                success: false,
                message: 'User already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name, dateOfBirth, gender, country, bloodGroup, phone, email, password: hashedPassword
        })
        await newUser.save()

        return res.status(200).send({
            success: false,
            message: 'Successfully registered'
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Failed to register',
            error: error.message
        });
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        const payload = { id: user._id, role: user.role };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        const cookieOptions = {
            httpOnly: true,
            secure: false, // true in production with HTTPS
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 // 1 hour
        };

        
        res.cookie('user_token', token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: { id: user._id, role: user.role, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


const logoutUser = async (req, res) => {
    try {
        res.clearCookie("user_token", {
            httpOnly: true,
            secure: true,     // set true if using HTTPS
            sameSite: "strict",
            path: "/",
        })
        res.clearCookie("admin_token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
        })
        res.clearCookie("author_token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
        })

        return res.status(200).json({
            success: true,
            message: "Successfully logged out"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}


const protectedAdmin=async(req,res)=>{
    try {
        const token= req.cookies.admin_token
        if(!token){
            return res.status(400).send({
                success: false,
                message: 'admin Token not found',

            })
        }
        req.status(200).send({
            success: true,
            message: 'Succesfully authenticated admin'
        })
    } catch (error) {
        req.status(500).send({
            success: false,
            message: "admin route couldn't br protected" + error
        })
        
    }
}



module.exports = {
    resgisterUser,
    loginUser,
    logoutUser,
    getUsers,
    protectedAdmin

}