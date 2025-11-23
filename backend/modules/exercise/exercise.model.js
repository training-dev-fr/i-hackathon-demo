const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const { Attachment } = require('../attachment/attachment.model');

const Exercise = sequelize.define('Exercise', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  max_tokens: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
  system: {type: DataTypes.TEXT}
},{tableName:"exercises"});

// Hook pour garantir qu’un seul exercice actif à la fois
Exercise.beforeUpdate(async (exercise, options) => {
  if (exercise.is_active) {
    // désactiver tous les autres exercices
    await Exercise.update({ is_active: false }, { where: { id: { [require('sequelize').Op.ne]: exercise.id } } });
  }
});

Exercise.beforeCreate(async (exercise, options) => {
  if (exercise.is_active) {
    await Exercise.update({ is_active: false }, {});
  }
});

Exercise.hasMany(Attachment, { foreignKey: 'exercise_id', as: 'attachments', onDelete: 'CASCADE' });
Attachment.belongsTo(Exercise, { foreignKey: 'exercise_id', as: 'exercise' });

module.exports = { Exercise };
