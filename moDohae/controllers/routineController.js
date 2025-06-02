const { Routine } = require('../models/routine');
const { Calendar } = require('../models/calendar');
const { verifyToken } = require('../utils/auth');

// 루틴 조회
const viewRoutine = async (req, res) => {
  const { token } = req.query;
  const { routineId } = req.body;

  try {
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const user = verifyToken(token);
    if (!user) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    if (!routineId) return res.status(400).json({ message: '루틴 ID가 필요합니다.' });

    const routine = await Routine.findOne({ where: { routine_id: routineId } });
    if (!routine) return res.status(404).json({ message: '루틴을 찾을 수 없습니다.' });
    if (routine.user_id !== user.id) return res.status(403).json({ message: '해당 루틴에 대한 권한이 없습니다.' });

    return res.status(200).json({ routine });
  } catch (error) {
    console.error('[viewRoutine error]', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 루틴 등록
const createRoutine = async (req, res) => {
  const { token } = req.query;
  const { name, content, time } = req.body;

  try {
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const user = verifyToken(token);
    if (!user) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    if (!name) return res.status(400).json({ message: '루틴 이름이 필요합니다.' });

    const routine = await Routine.create({
      user_id: user.id,
      name,
      content,
      time,
    });

    return res.status(201).json({ message: '루틴 등록에 성공했습니다.', routineId: routine.routine_id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '루틴 등록에 실패했습니다.' });
  }
};

// 루틴 선택 시 캘린더에 등록
const addRoutineToCalendar = async (req, res) => {
  const { token } = req.query;
  const { routineId } = req.body;

  try {
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const user = verifyToken(token);
    if (!user) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    if (!routineId) return res.status(400).json({ message: '루틴 ID가 필요합니다.' });

    const routine = await Routine.findByPk(routineId);
    if (!routine) return res.status(404).json({ message: '루틴을 찾을 수 없습니다.' });
    if (routine.user_id !== user.id) return res.status(403).json({ message: '해당 루틴에 대한 권한이 없습니다.' });

    // 캘린더에 등록
    await Calendar.create({
      user_id: user.id,
      title: routine.name,
      datetime: routine.time ? `${new Date().toISOString().slice(0, 10)}T${routine.time}` : new Date(),
      category: 'routine',
      start_date: null,
      end_date: null,
      created_at: new Date(),
    });

    return res.status(201).json({ message: '루틴이 캘린더에 등록되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '캘린더 등록에 실패했습니다.' });
  }
};

// 루틴 수정
const updateRoutine = async (req, res) => {
  const { token } = req.query;
  const { routineId, name, content, time } = req.body;

  try {
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const user = verifyToken(token);
    if (!user) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });

    const routine = await Routine.findByPk(routineId);
    if (!routine) return res.status(404).json({ message: '루틴을 찾을 수 없습니다.' });
    if (routine.user_id !== user.id) return res.status(403).json({ message: '해당 루틴에 대한 권한이 없습니다.' });

    if (name) routine.name = name;
    if (content) routine.content = content;
    if (time) routine.time = time;

    await routine.save();

    return res.status(200).json({ message: '루틴이 수정되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '루틴 수정에 실패했습니다.' });
  }
};

// 루틴 삭제
const deleteRoutine = async (req, res) => {
  const { token } = req.query;
  const { routineId } = req.body;

  try {
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const user = verifyToken(token);
    if (!user) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });

    const routine = await Routine.findByPk(routineId);
    if (!routine) return res.status(404).json({ message: '루틴을 찾을 수 없습니다.' });
    if (routine.user_id !== user.id) return res.status(403).json({ message: '해당 루틴에 대한 권한이 없습니다.' });

    await routine.destroy();

    return res.status(200).json({ message: '루틴이 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '루틴 삭제에 실패했습니다.' });
  }
};

module.exports = {
  viewRoutine,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  addRoutineToCalendar, // 추가
};