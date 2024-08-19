const { registerUser, loginUser, forgotPassword, verifyOtp, resetPassword, changePassword, signOut } = require("../controllers/auth.controllers");
const { verifyToken } = require("../middlewares/auth");
const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp)
router.patch("/reset-password", resetPassword)
router.patch("/change-password", verifyToken, changePassword);
router.post("/signout", verifyToken, signOut);

module.exports = router;
