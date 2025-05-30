// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_URL || {
  // 필요한 경우 환경변수 또는 직접 DB 연결 정보 입력
  // dialect: 'mysql',
  // host: 'localhost',
  // username: 'root',
  // password: '',
  // database: 'moDohae',
});

const User = require('./user')(sequelize, DataTypes);
const Challenge = require('./challenge')(sequelize, DataTypes);
const ChallengeMember = require('./challengeMember')(sequelize, DataTypes);
const Calendar = require('./calendar')(sequelize, DataTypes);
const Routine = require('./routine')(sequelize, DataTypes);
const AiRoutine = require('./aiRoutine')(sequelize, DataTypes);
const AiFeedback = require('./aiFeedback')(sequelize, DataTypes);

// 관계 설정
if (Challenge.associate) Challenge.associate({ User, ChallengeMember });
if (ChallengeMember.associate) ChallengeMember.associate({ Challenge, User });
if (Calendar.associate) Calendar.associate({ User });
if (Routine.associate) Routine.associate({ User });
if (AiRoutine.associate) AiRoutine.associate({ User });
if (AiFeedback.associate) AiFeedback.associate({ User });

// 모든 모델과 sequelize 인스턴스 export
module.exports = {
  sequelize,
  Sequelize,
  User,
  Challenge,
  ChallengeMember,
  Calendar,
  Routine,
  AiRoutine,
  AiFeedback,
};