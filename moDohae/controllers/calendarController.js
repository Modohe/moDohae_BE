const { Calendar } = require('../models/calendar');
const { verifyToken } = require('../utils/auth');
const jwt = require('jsonwebtoken');
const redisClient = require('../utils/redisClient'); // Redis 클라이언트

// 일정 조회
const viewSchedule = async (req, res) => {
  const { token } = req.query;
  const { scheduleId } = req.body;

  try {
    if (!token) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    // 토큰 검증 (verifyToken 사용으로 통일)
    const user = verifyToken(token);
    if (!user) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    if (!scheduleId) {
      return res.status(400).json({ message: '일정 ID가 필요합니다.' });
    }

    // 일정 DB에서 조회
    const schedule = await Calendar.findOne({ where: { id: scheduleId } });
    if (!schedule) {
      return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }

    // 본인 일정만 조회 가능
    if (schedule.userId !== user.id) {
      return res.status(403).json({ message: '해당 일정에 대한 권한이 없습니다.' });
    }

    return res.status(200).json({ schedule });
  } catch (error) {
    console.error('[viewSchedule error]', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 일정 등록
const writeSchedule = async (req, res) => {
  const { token } = req.query;
  const { date, title } = req.body;

  try {
    if (!token) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const user = verifyToken(token);
    if (!user) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    if (!title || !date) {
      return res.status(400).json({ message: '내용과 날짜를 입력해 주세요.' });
    }

    const schedule = await Calendar.create({
      userId: user.id,
      date,
      title,
    });

    return res.status(201).json({
      message: '일정 등록에 성공했습니다.',
      scheduleId: schedule.id,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '일정 등록에 실패했습니다.' });
  }
};

// 일정 수정
const updateSchedule = async (req, res) => {
  const { token } = req.query;
  const { scheduleId, title, date } = req.body;

  try {
    if (!token) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const user = verifyToken(token);
    if (!user) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    const schedule = await Calendar.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }

    if (schedule.userId !== user.id) {
      return res.status(403).json({ message: '해당 일정에 대한 권한이 없습니다.' });
    }

    if (title) schedule.title = title;
    if (date) schedule.date = date;

    await schedule.save();

    return res.status(200).json({ message: '일정이 수정되었습니다.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '일정 수정에 실패했습니다.' });
  }
};

// 일정 삭제
const deleteSchedule = async (req, res) => {
  const { token } = req.query;
  const { scheduleId } = req.body;

  try {
    if (!token) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const user = verifyToken(token);
    if (!user) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    const schedule = await Calendar.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }

    if (schedule.userId !== user.id) {
      return res.status(403).json({ message: '해당 일정에 대한 권한이 없습니다.' });
    }

    await schedule.destroy();

    return res.status(200).json({ message: '일정이 삭제되었습니다.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '일정 삭제에 실패했습니다.' });
  }
};

module.exports = {
  viewSchedule,
  writeSchedule,
  updateSchedule,
  deleteSchedule,
};
