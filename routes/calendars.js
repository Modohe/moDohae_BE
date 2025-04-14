const express = require('express');
const router = express.Router();
const {
  writeSchedule,
  updateSchedule,
  deleteSchedule,
} = require('../controllers/calendarController');

router.post('/schedule', writeSchedule);
router.put('/schedule', updateSchedule);
router.delete('/schedule', deleteSchedule);

module.exports = router;
