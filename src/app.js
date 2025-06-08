require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const authRoute = require('./routes/auth');
const summarizeRoute = require('./routes/summarize');
const healthRoute = require('./routes/health');
const authenticateToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/health', healthRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/summarize', authenticateToken, summarizeRoute);

// Error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Closing server...');
  server.close(() => {
    logger.info('Process terminated');
  });
});
