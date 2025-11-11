const winston = require('winston');

/**
 * Structured Logger using Winston
 * Logs with context, timestamps, and severity levels
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'mern-app' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          const stackStr = stack ? `\n${stack}` : '';
          return `${timestamp} [${level}]: ${message}${metaStr}${stackStr}`;
        })
      )
    })
  ]
});

// Add file transports only in production or if LOG_FILE env var is set
if (process.env.NODE_ENV === 'production' || process.env.LOG_FILE) {
  logger.add(new winston.transports.File({
    filename: process.env.LOG_FILE || 'app.log',
    format: winston.format.json()
  }));

  logger.add(new winston.transports.File({
    filename: process.env.ERROR_LOG_FILE || 'error.log',
    level: 'error',
    format: winston.format.json()
  }));
}

module.exports = logger;
