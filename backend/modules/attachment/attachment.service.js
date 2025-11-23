const path = require('path');
const fs = require('fs');
const { Attachment } = require('./attachment.model');
const { Exercise } = require('../exercise/exercise.model');

async function create(exerciseId, file) {
  const exercise = await Exercise.findByPk(exerciseId);
  if (!exercise) throw new Error('Exercise not found');
  const relativePath = file.path.replace(path.resolve(__dirname, '../../'), '').replace(/\\/g, '/');
  const attachment = await Attachment.create({
    exercise_id: exerciseId,
    filename: file.originalname,
    path: relativePath.startsWith('/') ? relativePath : `/${relativePath}`,
    type: file.mimetype,
  });

  return attachment;
}

async function getAll(exerciseId) {
  return Attachment.findAll({ where: { exercise_id: exerciseId } });
}

async function remove(id) {
  const attachment = await Attachment.findByPk(id);
  if (!attachment) throw new Error('Attachment not found');

  if (fs.existsSync(attachment.path)) {
    fs.unlinkSync(attachment.path);
  }

  await attachment.destroy();
  return { message: 'Attachment deleted successfully' };
}

module.exports = { create, getAll, remove };
