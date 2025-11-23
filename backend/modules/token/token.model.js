const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const { User } = require('../user/user.model');
const { Exercise } = require('../exercise/exercise.model');

const TokenUsage = sequelize.define('TokenUsage', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  exercise_id: { type: DataTypes.INTEGER, allowNull: false },
  tokens_used: { type: DataTypes.INTEGER, defaultValue: 0 },
  tokens_limit: { type: DataTypes.INTEGER, defaultValue: 10 }
},{tableName: "tokenusages"});

// Relations
TokenUsage.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
TokenUsage.belongsTo(Exercise, { foreignKey: 'exercise_id', onDelete: 'CASCADE' });

module.exports = { TokenUsage };
