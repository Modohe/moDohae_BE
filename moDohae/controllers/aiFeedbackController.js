const { AiFeedback } = require('../models/aiFeedback');
const { verifyToken } = require('../utils/auth');

// 피드백 목록 조회
const getAiFeedbacks = async (req, res) => {
  const { token } = req.query;
  try {
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const user = verifyToken(token);
    if (!user) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });

    const feedbacks = await AiFeedback.findAll({ where: { user_id: user.id } });
    return res.status(200).json({ feedbacks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 피드백 등록
const createAiFeedback = async (req, res) => {
  const { token } = req.query;
  const { topic, content, method } = req.body;
  try {
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const user = verifyToken(token);
    if (!user) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });

    const feedback = await AiFeedback.create({
      user_id: user.id,
      topic,
      content,
      method,
    });
    return res.status(201).json({ message: '피드백 등록에 성공했습니다.', feedbackId: feedback.feedback_id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '피드백 등록에 실패했습니다.' });
  }
};

// 피드백 삭제
const deleteAiFeedback = async (req, res) => {
  const { token } = req.query;
  const { feedbackId } = req.body;
  try {
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const user = verifyToken(token);
    if (!user) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });

    const feedback = await AiFeedback.findByPk(feedbackId);
    if (!feedback) return res.status(404).json({ message: '피드백을 찾을 수 없습니다.' });
    if (feedback.user_id !== user.id) return res.status(403).json({ message: '권한이 없습니다.' });

    await feedback.destroy();
    return res.status(200).json({ message: '피드백이 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '피드백 삭제에 실패했습니다.' });
  }
};

module.exports = {
  getAiFeedbacks,
  createAiFeedback,
  deleteAiFeedback,
};