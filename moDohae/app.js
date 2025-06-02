const express = require('express');
require('dotenv').config();
const cors = require('cors');

const userRouter = require('./routes/users');
const calendarRouter = require('./routes/calendars');
const challengeRouter = require('./routes/challenges');
const rankRouter = require('./routes/ranks');
const routineRouter = require('./routes/routines');
const aiRoutineRouter = require('./routes/aiRoutines');
const aiFeedbackRouter = require('./routes/aiFeedbacks');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// 라우터 등록
app.use('/user', userRouter);
app.use('/calendar', calendarRouter);
app.use('/challenge', challengeRouter);
app.use('/ranking', rankRouter);
app.use('/routine', routineRouter);
app.use('/ai-routine', aiRoutineRouter);
app.use('/ai-feedback', aiFeedbackRouter);

app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
