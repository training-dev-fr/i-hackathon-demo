const userService = require('./user.service');
const { success, error } = require('../../core/utils/response');

async function getAll(req, res) {
  try {
    const users = await userService.getAll();
    return success(res, users);
  } catch (err) {
    return error(res, err.message);
  }
}

async function getById(req, res) {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) return error(res, 'User not found', 404);
    return success(res, user);
  } catch (err) {
    return error(res, err.message);
  }
}

async function create(req, res) {
  try {
    const newUser = await userService.create(req.body);
    return success(res, newUser, 201);
  } catch (err) {
    return error(res, err.message);
  }
}

async function update(req, res) {
  try {
    const updated = await userService.update(req.params.id, req.body);
    return success(res, updated);
  } catch (err) {
    return error(res, err.message);
  }
}

async function remove(req, res) {
  try {
    await userService.remove(req.params.id);
    return success(res, { message: 'User deleted' });
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { getAll, getById, create, update, remove };
