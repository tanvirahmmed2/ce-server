require('dotenv').config()
const cloudinary = require('../config/cloudinary')
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
    if (password.length < 8) {
      return res.status(400).send({
        success: false,
        message: 'password length must be atleast 8 character'
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
      return res.status(404).send({ success: false, message: "User not found with this email. Please signup" });
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
      httpOnly: true,      // Prevents client-side JS from accessing the cookie
      secure: true,         // Ensures cookie is sent only over HTTPS
      sameSite: "none",     // Required for cross-site cookies (like frontend ↔ backend on different domains)
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    };

    res.cookie("user_token", token, cookieOptions);

    res.status(200).send({
      success: true,
      message: "Login successful",
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
      httpOnly: true,      // Prevents client-side JS from accessing the cookie
      secure: true,         // Ensures cookie is sent only over HTTPS
      sameSite: "none",
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

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email address.',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email. Please sign up.',
      });
    }

    // Generate 6-digit reset code using Math.random
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update token and expiry safely without triggering full validation
    await User.findByIdAndUpdate(
      user._id,
      {
        passwordResetToken: resetCode,
        passwordResetExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      },
      { runValidators: false } // skip other schema validations
    );

    const emailData = {
      email,
      subject: '🔐 Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>Hello ${user.name || 'User'},</h2>
          <p>Use the following code to reset your password. It expires in <b>10 minutes</b>.</p>
          <h1 style="background: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block;">${resetCode}</h1>
          <p>If you didn’t request this, please ignore this email.</p>
          <br/>
          <p>— CCIRL</p>
        </div>
      `,
    };

    // Send email with error handling
    try {
      await sendMail(emailData);
      console.log(`✅ Password reset code sent to ${email}`);
    } catch (mailError) {
      console.error('❌ Email sending failed:', mailError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again later.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reset code sent successfully. Please check your email.',
    });
  } catch (error) {
    // Structured logging for Render
    console.error('❌ forgetPassword error:', {
      message: error.message,
      stack: error.stack,
      errors: error.errors ? JSON.stringify(error.errors) : undefined,
    });

    res.status(500).json({
      success: false,
      message: 'Something went wrong while processing your request.',
    });
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
    if (newpassword.length < 8) {
      return res.status(400).send({
        success: false,
        message: 'password length must be atleast 8 character'
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


const deleteUser = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).send({
        succcess: false,
        message: 'Email is required'
      })
    }
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(400).send({
        succcess: false,
        message: 'No user found with this email'
      })
    }
    if (user.role === 'admin') {
      return res.status(400).send({
        succcess: false,
        message: 'Admin profile can not be deleted'
      })
    }
    await User.findOneAndDelete({ email: email })
    res.status(200).send({
      succcess: true,
      message: 'Succefully deleted profile'
    })
  } catch (error) {
    res.status(500).send({
      succcess: false,
      message: 'Profile delete process failed'
    })
  }
}



const addPublication = async (req, res) => {
  try {
    const { title, link, description, authorId } = req.body;

    if (!title || !link || !description || !authorId) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Author not found",
      });
    }

    if (user.role !== "author") {
      return res.status(400).send({
        success: false,
        message: "User is not an author",
      });
    }

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "PDF file is required",
      });
    }

    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const uploadedPdf = await cloudinary.uploader.upload(fileStr, {
      folder: "publications",
      resource_type: "raw",
    });

    const newPublication = {
      title,
      link,
      description,
      authorId,
      userName: user.name,
      pdf: uploadedPdf.secure_url,
      pdf_id: uploadedPdf.public_id,
    };

    user.publications.push(newPublication);
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Successfully submitted publication",
      publication: newPublication,
    });

  } catch (error) {
    console.error("Add Publication Error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to submit publication",
      error: error.message,
    });
  }
};



const removepubliaction = async (req, res) => {
  try {
    const { authorId, pubId } = req.body;

    if (!authorId || !pubId) {
      return res.status(400).send({
        success: false,
        message: "Author ID and publication ID are required",
      });
    }

    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Author not found",
      });
    }

    const publication = user.publications.id(pubId);
    if (!publication) {
      return res.status(404).send({
        success: false,
        message: "Publication not found",
      });
    }

    if (publication.pdf_id) {
      await cloudinary.uploader.destroy(publication.pdf_id, { resource_type: "raw" });
    }

    // 5️⃣ Remove publication from user
    await User.findByIdAndUpdate(
      authorId,
      { $pull: { publications: { _id: pubId } } },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Publication deleted successfully",
    });

  } catch (error) {
    console.error("Remove Publication Error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to delete publication",
      error: error.message,
    });
  }
};




const getPublications = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ _id: -1 })

    if (!users || users.length === 0) {
      return res.status(400).send({
        success: false,
        message: 'No user found'
      });
    }

    const publications = users.flatMap(user => user.publications || []);

    if (publications.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No publications found'
      });
    }

    res.status(200).send({
      success: true,
      message: 'Successfully fetched all publications',
      payload: publications
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Failed to fetch publications'
    });
  }
};



const protectedRoute = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    if (!token) return res.status(401).send({ success: false, user: null, message: 'Not logged in' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(401).send({ success: false, user: null, message: 'User not found' });

    res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(500).send({ success: false, user: null, message: 'Server error', error: error.message });
  }
};



const updateName = async (req, res) => {
  try {
    const { userId, name } = req.body
    if (!userId || !name) {
      return res.status(400).send({
        success: false,
        message: 'Enough resourch not found'
      })
    }
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'User not found'
      })
    }
    user.name = name
    await user.save()
    res.status(200).send({
      success: true,
      message: ' Successfully changed name'
    })
  } catch (error) {
    res.status(500).send({
      succcess: false,
      message: 'Name Change failed',
      error: error
    })

  }
}


const updateDob = async (req, res) => {
  try {
    const { userId, dateOfBirth } = req.body
    if (!userId || !dateOfBirth) {
      return res.status(400).send({
        success: false,
        message: 'Enough resourch not found'
      })
    }
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'User not found'
      })
    }
    user.dateOfBirth = dateOfBirth
    await user.save()
    res.status(200).send({
      success: true,
      message: ' Successfully changed Date of Birth'
    })
  } catch (error) {
    res.status(500).send({
      succcess: false,
      message: 'Date of birth Change failed',
      error: error
    })

  }
}




const updatePassword = async (req, res) => {
  try {
    const { userId, old_password, new_password } = req.body
    if (!userId || !old_password || !new_password) {
      return res.status(400).send({
        success: false,
        message: 'Enough resourch not found'
      })
    }
    if (old_password === new_password) {
      return res.status(400).send({
        success: false,
        message: 'New password cant be same as old password'
      })
    }
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'User not found'
      })
    }
    const passwordMatch = await bcrypt.compare(old_password, user.password);
    if (!passwordMatch) {
      return res.status(400).send({
        success: false,
        message: 'Old password didnot match. Please try again or reset password'
      })
    }
    if (new_password.length < 8) {
      return res.status(400).send({
        success: false,
        message: 'password length must be atleast 8 character'
      })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(new_password, salt);
    user.password = hashedPass
    await user.save()


    res.status(200).send({
      success: true,
      message: ' Password updated successfully'
    })




  } catch (error) {
    res.status(500).send({
      succcess: false,
      message: 'Password couldnot change',
      error: error
    })

  }
}


const addEducation = async (req, res) => {
  try {
    const { userId, degree, field, institution, startYear, endYear } = req.body
    if (!userId || !degree || !field || !institution || !startYear) {
      return res.status(400).send({
        success: false,
        message: 'All field are required'
      })
    }
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'User not found'
      })
    }
    user.education.push({ degree, field, institution, startYear, endYear })
    await user.save()
    res.status(200).send({
      success: true,
      message: 'Successfully added educational information'
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Failed to add Information'
    })

  }
}


const removeEducation = async (req, res) => {
  try {
    const { userId, eduId } = req.body;

    if (!userId || !eduId) {
      return res.status(400).send({
        success: false,
        message: "User ID and edu ID are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { education: { _id: eduId } } },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Information deleted successfully",
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to delete information",
      error: error.message,
    });
  }
};


const addWork = async (req, res) => {
  try {
    const { userId, position, company, startYear, endYear } = req.body
    if (!userId || !position || !company || !startYear) {
      return res.status(400).send({
        success: false,
        message: "All fields are required"
      })
    }
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "user not found"
      })
    }
    user.work.push({ position, company, startYear, endYear })
    await user.save()
    res.status(200).send({
      succcess: true,
      message: 'Successfully added work'
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Failed to add work'
    })

  }
}

const removeWork = async (req, res) => {
  try {
    const { userId, workId } = req.body;

    if (!userId || !workId) {
      return res.status(400).send({
        success: false,
        message: "User ID and work ID are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { work: { _id: workId } } },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Work Information deleted successfully",
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to delete work information",
      error: error.message,
    });
  }
};


const updateProfileImage = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: 'User ID not found',
      });
    }

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: 'Image not found',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      });
    }


    if (user.profileImage && user.profileImage.length > 0) {
      await cloudinary.uploader.destroy(user.profileImage_id);
      user.profileImage = '';
      user.profileImage_id = '';
    }


    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const uploadedImage = await cloudinary.uploader.upload(fileStr, { folder: 'user' });

    user.profileImage = uploadedImage.secure_url;
    user.profileImage_id = uploadedImage.public_id;

    await user.save();

    res.status(200).send({
      success: true,
      message: 'Successfully updated profile image',
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Could not upload profile image',
      error: error.message,
    });
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
  deleteUser,
  protectedRoute,
  addPublication,
  removepubliaction,
  getPublications,
  updateName,
  updateDob,
  updatePassword,
  addEducation,
  removeEducation,
  addWork,
  removeWork,
  updateProfileImage

}