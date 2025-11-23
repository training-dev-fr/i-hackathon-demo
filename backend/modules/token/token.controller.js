const tokenService = require('./token.service');
const { success, error } = require('../../core/utils/response');

async function getRemaining(req, res) {
  try {
    const { exerciseId } = req.query;
    if (!exerciseId) return error(res, 'Missing exerciseId', 400);
    const data = await tokenService.getRemaining(req.ip, exerciseId);
    return success(res, data);
  } catch (err) {
    return error(res, err.message);
  }
}

async function resetForGroup(req, res) {
  try {
    const { groupId, exerciseId } = req.body;
    if (!groupId || !exerciseId) return error(res, 'Missing parameters', 400);
    const result = await tokenService.resetForGroup(groupId, exerciseId);
    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { getRemaining, resetForGroup };
