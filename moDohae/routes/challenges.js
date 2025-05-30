// routes/challengeRouter.js
const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');

// 챌린지 조회
router.get('/', challengeController.viewChallenge);

// 챌린지 등록
router.post('/', challengeController.createChallenge);

// 챌린지 수정
router.put('/', challengeController.updateChallenge);

// 챌린지 삭제
router.delete('/', challengeController.deleteChallenge);

module.exports = router;
