const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
