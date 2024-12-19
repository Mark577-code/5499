const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ... 其他路由

router.post('/send-code', authController.sendVerificationCode);
router.post('/verify-code', authController.verifyCode);

module.exports = router;