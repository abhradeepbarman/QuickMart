const { registerUser, loginUser, forgotPassword, verifyOtp } = require("../controllers/auth.controllers");
const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp)

module.exports = router;
