const { TokenUsage } = require('./token.model');
const { Prompt } = require('./../prompt/prompt.model');
const { Exercise } = require('../exercise/exercise.model');

async function getRemaining(ip, exercise_id) {
  const record = await Prompt.findAll({ where: { ip, exercise_id } });
  const exercise = await Exercise.findByPk(exercise_id);
  if (!record) {
    const limit = exercise ? exercise.max_tokens : 10;
    return { remaining: limit, used: 0, limit };
  }

  const remaining = Math.max(0, exercise.max_tokens - record.reduce((total, prompt) => total + prompt.cost,0) );
  return { remaining, used: record.tokens_used, limit: record.tokens_limit };
}

async function useTokens(user_id, exercise_id, count = 1) {
  let record = await TokenUsage.findOne({ where: { user_id, exercise_id } });

  if (!record) {
    const exercise = await Exercise.findByPk(exercise_id);
    const limit = exercise ? exercise.max_tokens : 10;
    record = await TokenUsage.create({
      user_id,
      exercise_id,
      tokens_used: count,
      tokens_limit: limit
    });
  } else {
    record.tokens_used += count;
    await record.save();
  }

  return record;
}

async function resetForGroup(groupId, exerciseId) {
  const record = await TokenUsage.findOne({ where: { user_id: groupId, exercise_id: exerciseId } });

  if (record) {
    record.tokens_used = 0;
    await record.save();
  } else {
    const exercise = await Exercise.findByPk(exerciseId);
    const limit = exercise ? exercise.max_tokens : 10;
    await TokenUsage.create({
      user_id: groupId,
      exercise_id: exerciseId,
      tokens_used: 0,
      tokens_limit: limit
    });
  }

  return { message: 'Tokens reset successfully' };
}

module.exports = { getRemaining, useTokens, resetForGroup };
