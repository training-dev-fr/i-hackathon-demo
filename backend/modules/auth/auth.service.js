const bcrypt = require('bcryptjs');
const { generateToken } = require('../../config/jwt');
const { User } = require('../user/user.model');

async function login(username, password) {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('User not found');
  }
  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  return { token, user: { id: user.id, username: user.username, role: user.role } };
}

async function logout() {
  // Rien à faire côté serveur pour un JWT : le front le supprime simplement
  return { message: 'Logged out successfully' };
}

module.exports = { login, logout };