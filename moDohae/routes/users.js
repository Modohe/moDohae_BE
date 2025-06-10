// route/user.js
const express = require('express');
const { sendAuthEmail, verifyAuthCode } = require('../controllers/userController');
const { signup, login, logout } = require('../controllers/userController');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.post('/send-auth-email', sendAuthEmail);
router.post('/verify-auth-code', verifyAuthCode);
router.get('/info', userController.getUserInfo);
router.put('/info', userController.updateUserInfo);

module.exports = router;
