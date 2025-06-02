const express = require('express');
const router = express.Router();
const aiRoutineController = require('../controllers/aiRoutineController');

// AI 루틴 목록 조회
router.get('/', aiRoutineController.getAiRoutines);

// AI 루틴 등록
router.post('/', aiRoutineController.createAiRoutine);

// AI 루틴 성공/실패 업데이트
router.put('/', aiRoutineController.updateAiRoutine);

// AI 루틴 삭제
router.delete('/', aiRoutineController.deleteAiRoutine);

// AI 루틴 선택 시 캘린더에 등록
router.post('/add-to-calendar', aiRoutineController.addAiRoutineToCalendar);

module.exports = router;