const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { generateAccessToken, generateRefreshToken } = require('../services/tokenService');
const logger = require('../utils/logger');

// Validation schema
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

router.post('/login', (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    logger.warn('Invalid login payload');
    return res.status(400).json({ error: error.details[0].message });
  }

  const { username, password } = req.body;

  // Read expected username/password from env
  const expectedUsername = process.env.LOGIN_USERNAME;
  const expectedPassword = process.env.LOGIN_PASSWORD;

  if (username === expectedUsername && password === expectedPassword) {
    const payload = { username };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    logger.info(`User ${username} logged in`);
    res.json({ accessToken, refreshToken });
  } else {
    logger.warn(`Failed login attempt for user ${username}`);
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

module.exports = router;
