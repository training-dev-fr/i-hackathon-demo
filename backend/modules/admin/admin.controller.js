const adminService = require('./admin.service');
const { success, error } = require('../../core/utils/response');

async function getStats(req, res) {
  try {
    const stats = await adminService.getStats();
    return success(res, stats);
  } catch (err) {
    return error(res, err.message);
  }
}

async function getGroups(req, res) {
  try {
    const groups = await adminService.getGroups();
    return success(res, groups);
  } catch (err) {
    return error(res, err.message);
  }
}

async function getGroupProgress(req, res) {
  try {
    const exerciceId = req.params.exerciceId;
    const data = await adminService.getGroupProgress(exerciceId);
    return success(res, data);
  } catch (err) {
    return error(res, err.message);
  }
}

async function getOneGroupProgress(req, res) {
  try {
    const {exerciceId, groupId} = req.params;
    const data = await adminService.getOneGroupProgress(exerciceId,groupId);
    return success(res, data);
  } catch (err) {
    return error(res, err.message);
  }
}



module.exports = { getStats, getGroups, getGroupProgress,getOneGroupProgress };
