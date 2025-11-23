const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Invalid Authorization header format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contient id, username, role...
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};