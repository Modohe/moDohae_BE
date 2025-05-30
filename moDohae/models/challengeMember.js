module.exports = (sequelize, DataTypes) => {
  const ChallengeMember = sequelize.define('ChallengeMember', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    challenge_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'challenges',
        key: 'challenge_id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'idx',
      },
    },
    is_accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    joined_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'challenge_members',
    timestamps: false,
  });

  ChallengeMember.associate = (models) => {
    ChallengeMember.belongsTo(models.Challenge, { foreignKey: 'challenge_id', as: 'challenge' });
    ChallengeMember.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return ChallengeMember;
};