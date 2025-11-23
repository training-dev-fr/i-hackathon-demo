const exerciseService = require('./exercise.service');
const { success, error } = require('../../core/utils/response');

async function getOne(req, res) {
  try {
    const ex = await exerciseService.getOne(req.params.id);
    if (!ex) return error(res, 'Exercise not found', 404);
    return success(res, ex);
  } catch (err) {
    return error(res, err.message);
  }
}

async function getDemo(req, res) {
  try {
    const item = await exerciseService.getDemo();
    if (!item) return error(res, 'No active exercise found', 404);
    return success(res, item);
  } catch (err) {
    return error(res, err.message);
  }
}


module.exports = { getOne, getDemo};
