module.exports = (sequelize, DataTypes) => {
  return sequelize.define('AiFeedback', {
    feedback_id: {
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
    topic: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    method: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'ai_feedback',
    timestamps: false,
  });
};