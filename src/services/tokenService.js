const jwt = require('jsonwebtoken');

/**
 * Generates an access token.
 * 
 * @param {Object} payload - Payload to encode in token.
 * @returns {string} - JWT access token.
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY
  });
};

/**
 * Generates a refresh token.
 * 
 * @param {Object} payload - Payload to encode in token.
 * @returns {string} - JWT refresh token.
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
