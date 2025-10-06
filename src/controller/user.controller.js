const User = require("../model/user.model");
const bcrypt = require('bcryptjs')



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


module.exports = {
    resgisterUser,

}