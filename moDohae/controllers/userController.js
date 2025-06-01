const { User } = require('../models/user');
const Sequelize = require('sequelize');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const { where } = require("sequelize");
const crypto = require('crypto');
const redisClient = require('../utils/redisClient'); // Redis 클라이언트를 불러옵니다.
const nodemailer = require('nodemailer'); // 이메일 발송을 위한 nodemailer

// 이메일 인증 코드 전송
const sendAuthEmail = async (email) => {
  try {
    // 6자리 인증 코드 생성
    const authCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Redis에 저장 (유효시간: 10분)
    await new Promise((resolve, reject) => {
      redisClient.setex(email, 600, authCode, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Naver SMTP 설정
    const transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 465,
      secure: true, // SSL 사용
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '이메일 인증 코드',
      text: `회원가입을 위한 이메일 인증 코드: ${authCode}`
    };

    await transporter.sendMail(mailOptions);

    console.log(`이메일 전송 완료 → ${email}`);
  } catch (err) {
    console.error('이메일 전송 실패:', err);
    throw new Error('이메일 전송에 실패했습니다.');
  }
};

// 인증 코드 검증
const verifyAuthCode = async (email, authCode) => {
  return new Promise((resolve, reject) => {
    redisClient.get(email, (err, storedCode) => {
      if (err) return reject('인증 코드 확인 중 오류 발생');
      if (!storedCode) return reject('인증 코드가 만료되었거나 존재하지 않습니다.');
      if (storedCode === authCode) {
        resolve(true);
      } else {
        reject('잘못된 인증 코드입니다.');
      }
    });
  });
};

const signup = async (req, res) => {
  const { userid, userpw, email, nickname, birth, authCode } = req.body;

  try {
    // 이메일 인증 코드 확인
    try {
      await verifyAuthCode(email, authCode);
    } catch (err) {
      return res.status(400).json({ message: err.message || err });
    }

    const hashedPassword = await bcrypt.hash(userpw, 10);

    const existUser = await User.findOne({ where: { userid } });
    const existEmail = await User.findOne({ where: { email } });
    const existUserNick = await User.findOne({ where: { nickname } });

    if (existUser) {
      return res.status(409).json({ message: "중복된 아이디입니다." });
    }

    if (existEmail) {
      return res.status(409).json({ message: "이미 가입된 이메일입니다." });
    }

    if (existUserNick) {
      return res.status(409).json({ message: "중복된 닉네임입니다." });
    }

    await User.create({
      userid,
      userpw: hashedPassword,
      email,
      nickname,
      birth
    });

    return res.status(201).json({ message: "회원가입에 성공했습니다." });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "요청에 실패했습니다." });
  }
};

const login = async (req, res) => {
  const { userid, userpw } = req.body;

  try {
    const thisUser = await User.findOne({ where: { userid } });
    if (!thisUser) {
      return res.status(404).json({ message: "존재하지 않는 아이디입니다." });
    }

    const isPassword = await bcrypt.compare(userpw, thisUser.userpw);

    if (!isPassword) {
      return res.status(409).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const accessToken = jwt.sign({ userid: thisUser.userid }, process.env.SECRET, { expiresIn: "1h" });

    await thisUser.update({ token: accessToken });

    return res.status(201).json({ message: "로그인에 성공했습니다.", accessToken });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "요청에 실패했습니다." });
  }
};

const logout = async (req, res) => {
  const { userid } = req.decoded;

  try {
    if (!userid) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const thisUser = await User.findOne({ where: { userid } });
    if (!thisUser) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    await thisUser.update({ token: null });

    return res.status(200).json({ message: "로그아웃에 성공했습니다." });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "요청에 실패했습니다." });
  }
};

module.exports = {
  signup, 
  login, 
  logout, 
  sendAuthEmail, 
  verifyAuthCode
 };
