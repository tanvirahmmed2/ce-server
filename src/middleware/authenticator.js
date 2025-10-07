require('dotenv').config();
const jwt = require('jsonwebtoken');

const isLogin = (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found. Please login first"
            });
        }


        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(403).json({
                success: false,
                message: "JWT verification failed",
                error: err.message
            });
        }

        req.user = decoded;
        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Is login failed, please login",
            error: error.message
        });
    }
};


const isAdmin = (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User token not found"
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You're not an admin"
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin authentication failed",
      error: error.message
    });
  }
};

const isAuthor = (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User token not found"
      });
    }

    if (user.role !== 'author') {
      return res.status(403).json({
        success: false,
        message: "You're not an author"
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Author authentication failed",
      error: error.message
    });
  }
};


module.exports = {
    isLogin, isAdmin, isAuthor
};
