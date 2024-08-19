const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const otpGenerator = require("otp-generator");
const { mailSender } = require("../utils/sendMail");
const { forgotPasswordTemplate } = require("../templates/forgot-password-mail");
const Otp = require("../models/otp.model");

exports.registerUser = async (req, res) => {
    // validation
    // check if user already exists
    // hash password
    // create user
    // return response

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields",
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
        });

        if (!newUser) {
            return res.status(500).json({
                success: false,
                message: "Error while registering user",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            newUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.loginUser = async (req, res) => {
    // validation
    // check if user exists
    // check if password is correct
    // token generate
    // return response

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields",
            });
        }

        const user = await User.findOne({ email })?.select("+password");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist, Please register first",
            });
        }

        if (!user.isActive) {
            return res.status(400).json({
                success: false,
                message: "User is not active, Please contact admin",
            });
        }

        const isSame = await bcrypt.compare(password, user.password);
        if (!isSame) {
            return res.status(400).json({
                success: false,
                message: "Password is incorrect",
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        user.password = undefined;
        user.isActive = undefined;

        return res
            .cookie("auth_token", token, {
                httpOnly: true,
                secure: true,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            })
            .status(200)
            .json({
                success: true,
                message: "User logged in successfully",
                user: { ...user.toObject(), token },
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            });
        }

        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        const isMailSent = await mailSender({
            receiver: email,
            subject: "Forgot Password",
            message: forgotPasswordTemplate(otp),
        });

        if (!isMailSent) {
            return res.status(500).json({
                success: false,
                message: "Error while sending mail",
            });
        }

        const newOtp = await Otp.create({
            email,
            otp,
        });

        if (!newOtp) {
            return res.status(500).json({
                success: false,
                message: "Error while saving otp",
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp: newOtp.otp,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.verifyOtp = async (req, res) => {
    // {email, otp}
    // validation
    // search in db
    // compare otp
    // return response

    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const recentOtp = await Otp.find({ email })
            ?.sort({ createdAt: -1 })
            ?.limit(1);

        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "Otp expired or You've entered wrong email",
            });
        }

        if (recentOtp[0].otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid otp",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Otp verified successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.resetPassword = async (req, res) => {
    // take input
    // validate
    // compare password
    // check if user exists
    // hash password    
    // save in db
    // return response

    try {
        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (!hashedPassword) {
            return res.status(500).json({
                success: false,
                message: "Error while hashing password",
            });
        }

        user.password = hashedPassword;
        const updatedUser = await user.save();

        if (!updatedUser) {
            return res.status(500).json({
                success: false,
                message: "Error while updating password",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
            updatedUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.changePassword = async (req, res) => {
    // take input
    // validate
    // compare passwords
    // check if user exists
    // hash password
    // update password
    // return response

    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const userId = req.userId;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const user = await User.findById(userId)?.select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            });
        }        
        
        const isSame = await bcrypt.compare(oldPassword, user.password);
        
        if (!isSame) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        const updatedUser = await user.save();

        if (!updatedUser) {
            return res.status(500).json({
                success: false,
                message: "Error while updating password",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
            updatedUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.signOut = async(req, res) => {
    try {
        res.clearCookie("auth_token");

        return res.status(200).json({
            success: true,
            message: "Sign out successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}