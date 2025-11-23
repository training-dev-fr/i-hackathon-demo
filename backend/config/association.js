const { Attachment } = require("../modules/attachment/attachment.model");
const { Exercise } = require("../modules/exercise/exercise.model");


// Déclaration des relations ici
function setupAssociations() {
  Exercise.hasMany(Attachment, {
    foreignKey: 'exercise_id',
    as: 'attachments',
    onDelete: 'CASCADE',
  });
  Attachment.belongsTo(Exercise, {
    foreignKey: 'exercise_id',
    as: 'exercise',
  });
}

module.exports = { setupAssociations };