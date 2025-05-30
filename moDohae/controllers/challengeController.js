// controllers/challengeController.js
const { Challenge } = require('../models/challenge');
const redisClient = require('../utils/redisClient'); // Redis 클라이언트를 불러옵니다.

// 챌린지 조회
const viewChallenge = async (req, res) => {
  const { token } = req.query;
  const { challengeId } = req.body;

  try {
    if (!token) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }

    const userData = await redisClient.get(token);
    if (!userData) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다' });
    }

    if (!challengeId) {
      return res.status(400).json({ message: '챌린지 ID가 필요합니다' });
    }

    const challenge = await Challenge.findOne({ where: { id: challengeId } });
    if (!challenge) {
      return res.status(404).json({ message: '챌린지를 찾을 수 없습니다' });
    }

    return res.status(200).json({ challenge });
  } catch (error) {
    console.error('[viewChallenge error]', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 챌린지 등록
const createChallenge = async (req, res) => {
  const { token } = req.query;
  const { title, description, level } = req.body;

  try {
    if (!token) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const userData = await redisClient.get(token);
    if (!userData) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    if (!title || !description || !level) {
      return res.status(400).json({ message: '모든 필드를 입력해 주세요.' });
    }

    const challenge = await Challenge.create({
      title,
      description,
      level,
    });

    return res.status(201).json({
      message: '챌린지 등록에 성공했습니다.',
      challengeId: challenge.id,
    });
  } catch (error) {
    console.error('[createChallenge error]', error);
    return res.status(500).json({ message: '챌린지 등록에 실패했습니다.' });
  }
};

// 챌린지 수정
const updateChallenge = async (req, res) => {
  const { token } = req.query;
  const { challengeId, title, description, level } = req.body;

  try {
    if (!token) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const userData = await redisClient.get(token);
    if (!userData) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: '챌린지를 찾을 수 없습니다.' });
    }

    if (title) challenge.title = title;
    if (description) challenge.description = description;
    if (level) challenge.level = level;

    await challenge.save();

    return res.status(200).json({ message: '챌린지가 수정되었습니다.' });
  } catch (error) {
    console.error('[updateChallenge error]', error);
    return res.status(500).json({ message: '챌린지 수정에 실패했습니다.' });
  }
};

// 챌린지 삭제
const deleteChallenge = async (req, res) => {
  const { token } = req.query;
  const { challengeId } = req.body;

  try {
    if (!token) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const userData = await redisClient.get(token);
    if (!userData) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: '챌린지를 찾을 수 없습니다.' });
    }

    await challenge.destroy();

    return res.status(200).json({ message: '챌린지가 삭제되었습니다.' });
  } catch (error) {
    console.error('[deleteChallenge error]', error);
    return res.status(500).json({ message: '챌린지 삭제에 실패했습니다.' });
  }
};

module.exports = {
  viewChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
};
