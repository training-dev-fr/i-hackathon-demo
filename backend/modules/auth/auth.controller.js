const authService = require('./auth.service');
const { success, error } = require('../../core/utils/response');

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const result = await authService.login(username, password);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 401);
  }
}

async function logout(req, res) {
  try {
    const result = await authService.logout();
    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { login, logout };