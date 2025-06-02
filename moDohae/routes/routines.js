const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');

// 루틴 목록 조회 (필요하다면 추가)
// router.get('/', routineController.getRoutines);

// 루틴 조회
router.get('/view', routineController.viewRoutine);

// 루틴 등록
router.post('/', routineController.createRoutine);

// 루틴 수정
router.put('/', routineController.updateRoutine);

// 루틴 삭제
router.delete('/', routineController.deleteRoutine);

// 루틴 선택 시 캘린더에 등록
router.post('/add-to-calendar', routineController.addRoutineToCalendar);

module.exports = router;