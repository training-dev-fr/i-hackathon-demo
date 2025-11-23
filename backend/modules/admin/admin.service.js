const { User } = require('../user/user.model');
const { Exercise } = require('../exercise/exercise.model');
const { Prompt } = require('../prompt/prompt.model');
const { TokenUsage } = require('../token/token.model');
const { Op } = require('sequelize');
const { Student } = require('../student/student.model');

async function getStats() {
  const totalUsers = await User.count();
  const totalExercises = await Exercise.count();
  const totalPrompts = await Prompt.count();
  const totalTokensUsed = await TokenUsage.sum('tokens_used') || 0;

  return {
    totalUsers,
    totalExercises,
    totalPrompts,
    totalTokensUsed
  };
}

async function getGroups() {
  // chaque "User" correspond à un groupe
  const groups = await User.findAll({
    attributes: ['id', 'username',],
    include: [{model: Student, as : "students"}]
  });
  return groups;
}

async function getGroupProgress(exerciseId) {
  const groups = await User.findAll({
    include: [{
      model: Student,
      as: "students"
    },{
      model: Prompt,
      required: false,
      where: {
        exercise_id : exerciseId
      }
    }]
  })
  return groups;
}

async function getOneGroupProgress(exerciseId, groupId) {
  const groups = await User.findOne({
    where: {
      id: groupId
    },
    include: [{
      model: Student,
      as: "students"
    },{
      model: Prompt,
      required: false,
      where: {
        exercise_id : exerciseId
      }
    }]
  })
  return groups;
}



module.exports = { getStats, getGroups, getGroupProgress,getOneGroupProgress };
