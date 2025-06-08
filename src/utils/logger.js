const { createLogger, transports, format } = require('winston');

/**
 * Winston logger configured for console output only.
 */
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
