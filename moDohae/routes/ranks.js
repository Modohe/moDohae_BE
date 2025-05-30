const express = require('express');
const router = express.Router();
const rankController = require('../controllers/rankController');

// GET /ranking - 유저 랭킹 조회
router.get('/', rankController.getUserRanking);

module.exports = router;