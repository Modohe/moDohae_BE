const { AiRoutine } = require('../models/aiRoutine');
const { Calendar } = require('../models/calendar');
const { verifyToken } = require('../utils/auth');

// AI 루틴 목록 조회
const getAiRoutines = async (req, res) => {
  const { token } = req.query;
  try {
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const user = verifyToken(token);
    if (!user) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });

    const routines = await AiRoutine.findAll({ where: { user_id: user.id } });
    return res.status(200).json({ routines });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// AI 루틴 등록
const createAiRoutine = async (req, res) => {
  const { token } = req.query;
  const { name, content, time, level } = req.body;
  try {
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const user = verifyToken(token);
    if (!user) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });

    // 1. AI 루틴 생성
    const routine = await AiRoutine.create({
      user_id: user.id,
      name,
      content,
      time,
      level,
    });

    // 2. 캘린더에 추가
    await Calendar.create({
      user_id: user.id,
      title: name,
      datetime: time ? `${new Date().toISOString().slice(0, 10)}T${time}` : new Date(), // 오늘 날짜+시간, time 없으면 현재시간
      category: 'ai_routine',
      start_date: null,
      end_date: null,
      created_at: new Date(),
    });

    return res.status(201).json({ message: 'AI 루틴 등록 및 캘린더 추가에 성공했습니다.', aiRoutineId: routine.ai_routine_id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'AI 루틴 등록에 실패했습니다.' });
  }
};

// AI 루틴 성공/실패 업데이트
const updateAiRoutine = async (req, res) => {
  const { token } = req.query;
  const { aiRoutineId, is_success } = req.body;
  try {
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const user = verifyToken(token);
    if (!user) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });

    const routine = await AiRoutine.findByPk(aiRoutineId);
    if (!routine) return res.status(404).json({ message: 'AI 루틴을 찾을 수 없습니다.' });
    if (routine.user_id !== user.id) return res.status(403).json({ message: '권한이 없습니다.' });

    routine.is_success = is_success;
    await routine.save();

    return res.status(200).json({ message: 'AI 루틴 상태가 변경되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'AI 루틴 수정에 실패했습니다.' });
  }
};

// AI 루틴 삭제
const deleteAiRoutine = async (req, res) => {
  const { token } = req.query;
  const { aiRoutineId } = req.body;
  try {
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const user = verifyToken(token);
    if (!user) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });

    const routine = await AiRoutine.findByPk(aiRoutineId);
    if (!routine) return res.status(404).json({ message: 'AI 루틴을 찾을 수 없습니다.' });
    if (routine.user_id !== user.id) return res.status(403).json({ message: '권한이 없습니다.' });

    await routine.destroy();
    return res.status(200).json({ message: 'AI 루틴이 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'AI 루틴 삭제에 실패했습니다.' });
  }
};

// AI 루틴 선택 시 캘린더에 등록
const addAiRoutineToCalendar = async (req, res) => {
  const { token } = req.query;
  const { aiRoutineId } = req.body;

  try {
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const user = verifyToken(token);
    if (!user) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    if (!aiRoutineId) return res.status(400).json({ message: 'AI 루틴 ID가 필요합니다.' });

    const routine = await AiRoutine.findByPk(aiRoutineId);
    if (!routine) return res.status(404).json({ message: 'AI 루틴을 찾을 수 없습니다.' });
    if (routine.user_id !== user.id) return res.status(403).json({ message: '권한이 없습니다.' });

    // 캘린더에 등록
    await Calendar.create({
      user_id: user.id,
      title: routine.name,
      datetime: routine.time ? `${new Date().toISOString().slice(0, 10)}T${routine.time}` : new Date(),
      category: 'ai_routine',
      start_date: null,
      end_date: null,
      created_at: new Date(),
    });

    return res.status(201).json({ message: 'AI 루틴이 캘린더에 등록되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '캘린더 등록에 실패했습니다.' });
  }
};

module.exports = {
  getAiRoutines,
  createAiRoutine,
  updateAiRoutine,
  deleteAiRoutine,
  addAiRoutineToCalendar,
};