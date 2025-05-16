import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { prisma } from './utils/prisma';
import dotenv from 'dotenv';
import { corsOptions } from './utils/corsOptions';
import { logger } from './utils/logger';
import router from './routes/routes';

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan('tiny', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(express.json());

// Health Check Route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/', router);

// Graceful Shutdown
const gracefulShutdown = async (
  signal: string,
  serverInstance: ReturnType<typeof app.listen>
) => {
  logger.info(`${signal} received. Shutting down gracefully.`);
  serverInstance.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Force shutting down after timeout.');
    process.exit(1);
  }, 10000);
};

const serverInstance = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM', serverInstance));
process.on('SIGINT', () => gracefulShutdown('SIGINT', serverInstance));

const server = app;

export { app, server };
