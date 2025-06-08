const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Express middleware to authenticate JWT token.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    logger.warn('Missing JWT token');
    return res.status(401).json({ error: 'Missing token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn('Invalid JWT token');
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
