const express = require('express');
require('dotenv').config();
const cors = require('cors');

const userRouter = require('./routes/users');
const calendarRouter = require('./routes/calendars');
const challengeRouter = require('./routes/challenges');
const rankRouter = require('./routes/ranks');
// app.js - Express 서버 설정 및 라우터 연결

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 이메일 인증만 컨트롤러 직접 연결 (필요시 라우터로 분리 가능)
app.post('/send-auth-email', require('./controllers/userController').sendAuthEmail);

// 라우터 등록
app.use('/user', userRouter);
app.use('/calendar', calendarRouter);
app.use('/challenge', challengeRouter);
app.use('/ranking', rankRouter);

app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
