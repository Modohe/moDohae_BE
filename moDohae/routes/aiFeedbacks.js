const express = require('express');
const router = express.Router();
const aiFeedbackController = require('../controllers/aiFeedbackController');

// 피드백 목록 조회
router.get('/', aiFeedbackController.getAiFeedbacks);

// 피드백 등록
router.post('/', aiFeedbackController.createAiFeedback);

// 피드백 삭제
router.delete('/', aiFeedbackController.deleteAiFeedback);

module.exports = router;