// models/challenge.js
module.exports = (sequelize, DataTypes) => {
  const Challenge = sequelize.define('Challenge', {
    challenge_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'idx',
      },
    },
    is_team: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_shared: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'challenges',
    timestamps: false,
  });

  Challenge.associate = (models) => {
    Challenge.belongsTo(models.User, { foreignKey: 'creator_id', as: 'creator' });
    Challenge.hasMany(models.ChallengeMember, { foreignKey: 'challenge_id', as: 'members' });
  };

  return Challenge;
};
