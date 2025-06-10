// route/user.js
const express = require('express');
const { signup, login, logout, sendAuthEmail, verifyAuthCode, getUserInfo, updateUserInfo } = require('../controllers/userController');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.post('/send-auth-email', sendAuthEmail);
router.post('/verify-auth-code', verifyAuthCode);
router.get('/info', getUserInfo);
router.patch('/info', updateUserInfo);

module.exports = router;
