const rateLimit = require('express-rate-limit');

/**
 * Express middleware for rate limiting requests.
 */
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});

module.exports = limiter;
