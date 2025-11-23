const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET || 'devsecret';

function generateToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };