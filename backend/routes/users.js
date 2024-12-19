const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/avatar', auth, userController.updateAvatar);

module.exports = router; 