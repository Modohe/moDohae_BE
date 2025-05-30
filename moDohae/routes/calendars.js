const express = require('express');
const router = express.Router();
const {
  viewSchedule,
  writeSchedule,
  updateSchedule,
  deleteSchedule,
} = require('../controllers/calendarController');

// 일정 조회
router.get('/schedule', viewSchedule);
// 일정 등록
router.post('/schedule', writeSchedule);
// 일정 수정
router.put('/schedule', updateSchedule);
// 일정 삭제
router.delete('/schedule', deleteSchedule);

module.exports = router;
