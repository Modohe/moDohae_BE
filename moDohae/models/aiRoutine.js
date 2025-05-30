module.exports = (sequelize, DataTypes) => {
  return sequelize.define('AiRoutine', {
    ai_routine_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'idx',
      },
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    level: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    recommended_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    is_success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'ai_routines',
    timestamps: false,
  });
};