const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Attachment = sequelize.define('Attachment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  exercise_id: { type: DataTypes.INTEGER, allowNull: false },
  filename: { type: DataTypes.STRING, allowNull: false },
  path: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: true },
  uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
},{tableName:"attachments"});

module.exports = { Attachment };
