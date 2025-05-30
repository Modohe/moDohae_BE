// controller/emailController.js
const redisClient = require('../utils/redisClient'); // redisClient를 utils에서 불러옵니다.
const crypto = require('crypto');

// 이메일 인증 코드 생성 및 Redis에 저장
const sendAuthEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // 6자리 랜덤 인증 코드 생성
    const authCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    // Redis에 인증 코드 저장 (유효 시간 10분)
    redisClient.setex(email, 600, authCode);

    // 여기서 실제 이메일 전송 로직을 구현 (예: nodemailer 사용)
    console.log(`이메일로 인증 코드: ${authCode} 전송`);

    return res.status(200).json({ message: '인증 코드가 이메일로 전송되었습니다.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '이메일 인증 코드 전송에 실패했습니다.' });
  }
};

// 이메일 인증 코드 확인
const verifyAuthCode = async (req, res) => {
  const { email, authCode } = req.body;

  try {
    redisClient.get(email, (err, storedAuthCode) => {
      if (err) {
        return res.status(500).json({ message: '인증 코드 확인 중 오류가 발생했습니다.' });
      }

      if (storedAuthCode === authCode) {
        return res.status(200).json({ message: '인증 코드가 일치합니다.' });
      } else {
        return res.status(400).json({ message: '잘못된 인증 코드입니다.' });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '인증 코드 확인에 실패했습니다.' });
  }
};

module.exports = {
  sendAuthEmail,
  verifyAuthCode,
};
