const { Attachment } = require('../attachment/attachment.model');
const { Exercise } = require('./exercise.model');

async function getDemo() {
  return Exercise.findAll({
    include: [
      {
        model: Attachment,
        as: 'attachments',
        attributes: ['id', 'filename', 'path', 'type', 'uploaded_at']
      }
    ],
    order: [['id', 'ASC']],
    where:{
      id: [3,7,13]
    }
  });
}



async function getOne(id) {
  if( !['3','7','13'].includes(id)){
    throw new Error("Exercice invalide");
  }
  return Exercise.findByPk(id, {
    include: [
      {
        model: Attachment,
        as: 'attachments',
        attributes: ['id', 'filename', 'path', 'type', 'uploaded_at']
      }
    ],
  });
}

module.exports = { getOne, getDemo };
