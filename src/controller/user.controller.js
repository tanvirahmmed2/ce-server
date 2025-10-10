require('dotenv').config()
const User = require("../model/user.model");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { sendMail } = require('../config/transporter');

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
        message: 'User already exists with this email'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name, dateOfBirth, gender, country, bloodGroup, phone, email, password: hashedPassword
    })
    await newUser.save()

    const emaildata = {
      email,
      subject: `${name} , Welcome to CCIRL`,
      html: `
       <p>We’re thrilled to have you with us. At CCIRL, we believe in collaboration, innovation, and growth. Together, we can achieve great things and make a lasting impact.</p>
       <h1>Have a great journey!</h1>
      `
    }
    sendMail(emaildata)


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
      return res.status(400).send({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).send({ success: false, message: "Incorrect password" });
    }
    if (user.isBanned) {
      return res.status(400).send({ success: false, message: " User is banned" });
    }

    const payload = { id: user._id, role: user.role, email: user.email };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 hour
    };

    res.cookie("user_token", token, cookieOptions);

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server error",
      error: error.message,
    });
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
    return res.status(200).send({
      success: true,
      message: "Successfully logged out"
    })
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server error", error: error.message });
  }
}

const updateRole = async (req, res) => {
  try {
    const { email, role } = req.body
    if (!email || !role) {
      return res.status(400).send({
        succcess: false,
        message: 'Please email and new role'
      })
    }
    const existUser = await User.findOne({ email: email })
    if (!existUser) {
      return res.status(400).send({
        success: false,
        message: 'No use found with this email'
      })
    }
    if (existUser.role === role) {
      return res.status(400).send({
        succcess: false,
        message: "user already" + role
      })
    }
    const updateUser = await User.findOneAndUpdate({ email }, { role }, { new: true })
    if (!updateUser) {
      return res.status(400).send({
        success: false,
        message: "Couldn't update role"
      })
    }
    res.status(200).send({
      success: false,
      message: "Successfully updated role"
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Failed to update user role',
      error: error
    })
  }

}


const updateBan = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: 'Email is required'
      });
    }

    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(404).send({
        success: false,
        message: 'User not found with this email'
      });
    }

    const newStatus = !existUser.isBanned;
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { isBanned: newStatus },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).send({
        success: false,
        message: "Couldn't update user ban status"
      });
    }

    res.status(200).send({
      success: true,
      message: newStatus ? 'User successfully banned' : 'User successfully unbanned',
      user: updatedUser
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Failed to update ban status',
      error: error.message
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ success: false, message: 'Please enter email address' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ success: false, message: 'No user found with this email. Please sign up' });

    const forgetcode = Math.floor(100000 + Math.random() * 900000).toString(); // Save as string
    const codeExpireDate = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.passwordResetToken = forgetcode;
    user.passwordResetExpires = codeExpireDate;

    await user.save(); 

    const emaildata = {
      email,
      subject: 'Password reset code',
      html: `
        <h2>Hello ${user.name}</h2>
        <p>Please use this code for your account recovery:</p>
        <h1>${forgetcode}</h1>
      `
    };

    sendMail(emaildata);

    res.status(200).send({ success: true, message: 'Please check your mail' });

  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Failed to reset password' });
  }
};




const resetPassword = async (req, res) => {
  try {
    const { email, code, newpassword } = req.body
    if (!email || !code || !newpassword) {
      return res.status(400).send({
        success: false,
        message: 'All fields are required'
      })
    }
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'No user found with this email. Please sign up'
      })
    }
    if (user.passwordResetToken !== code.trim()) {
      return res.status(400).send({
        success: false,
        message: 'Wrong code. Please check your mail or try again'
      })
    }

    if (user.passwordResetExpires < Date.now()) {
      return res.status(400).send({
        success: false,
        message: 'code expired. Please send code again'
      })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    user.password = hashedPassword

    await user.save()

    res.status(200).send({
      success: true,
      message: 'Password changed successfully please login now'
    })


  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Failed to change password'
    })
  }
}






const protectedRoute = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    if (!token) return res.status(401).send({ success: false, message: 'Not logged in' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // exclude password

    res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Server error', error: error.message });
  }
};



module.exports = {
  resgisterUser,
  loginUser,
  logoutUser,
  getUsers,
  updateRole,
  updateBan,
  forgetPassword,
  resetPassword,
  protectedRoute

}