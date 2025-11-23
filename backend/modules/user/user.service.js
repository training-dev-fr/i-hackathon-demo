const { User } = require('./user.model');
const bcrypt = require('bcryptjs');

async function getAll() {
  return User.findAll({ attributes: { exclude: ['password'] } });
}

async function getById(id) {
  return User.findByPk(id, { attributes: { exclude: ['password'] } });
}

async function create(data) {
  const existing = await User.findOne({ where: { username: data.username } });
  if (existing) throw new Error('Username already exists');

  const user = await User.create({
    username: data.username,
    password: data.password,
    is_admin: data.is_admin || false
  });

  return user;
}

async function update(id, data) {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  await user.update(data);
  return user;
}

async function remove(id) {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  await user.destroy();
  return true;
}

module.exports = { getAll, getById, create, update, remove };
