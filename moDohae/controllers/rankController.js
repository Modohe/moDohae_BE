const express = require('express');
const router = express.Router();
const { User } = require('../models/user');

// 유저 랭킹 조회 (score 기준 상위 10명)
const getUserRanking = async (req, res) => {
  try {
    const ranking = await User.findAll({
      attributes: ['idx', 'userid', 'nickname', 'score'],
      order: [['score', 'DESC']],
      limit: 10,
    });
    return res.status(200).json({ ranking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '랭킹 조회에 실패했습니다.' });
  }
};

module.exports = {
  getUserRanking,
};