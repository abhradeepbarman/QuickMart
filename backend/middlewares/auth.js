const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
    try {
        const token =
            req.cookies["auth_token"] ||
            req.body.token ||
            (req.headers.authorization &&
                req.headers.authorization.replace("Bearer ", ""));

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied",
            });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (!verified) {
            return res.status(401).json({
                success: false,
                message: "Access Denied",
            });
        }

        req.userId = verified.userId;
        next();
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
