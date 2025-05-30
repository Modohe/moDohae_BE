module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Routine', {
    routine_id: {
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
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'routines',
    timestamps: false,
  });
};