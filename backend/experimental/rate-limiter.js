// Experimental rate limiter - NOT PRODUCTION READY
// TODO: Complete this implementation and add proper testing

const rateLimit = require('express-rate-limit');

// Basic rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
    data: null
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    data: null
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// FIXME: This needs better configuration
const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Rate limit exceeded',
    data: null
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// TODO: Add Redis store for distributed rate limiting
// TODO: Add different limits for different user types
// TODO: Add whitelist for admin IPs

module.exports = {
  loginLimiter,
  apiLimiter,
  strictLimiter
};
