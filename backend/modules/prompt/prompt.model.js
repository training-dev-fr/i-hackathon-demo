const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const { Exercise } = require('../exercise/exercise.model');

const Prompt = sequelize.define('Prompt', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  exercise_id: { type: DataTypes.INTEGER, allowNull: false },
  prompt_text: { type: DataTypes.TEXT, allowNull: false },
  attachments: { type: DataTypes.JSON, allowNull: true },
  response_data: { type: DataTypes.JSON, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  iaPrompt: {type: DataTypes.TEXT},
  cost: {type: DataTypes.INTEGER, defaultValue: 0},
  validate: {type: DataTypes.BOOLEAN,defaultValue: false},
  ip: {type: DataTypes.STRING, allowNull: false}
},{tableName: "prompts_demo"});

// Relations
Prompt.belongsTo(Exercise, { foreignKey: 'exercise_id', onDelete: 'CASCADE' });

module.exports = { Prompt };
