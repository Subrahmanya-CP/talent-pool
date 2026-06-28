import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import resumeRoutes from './routes/resumeRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import jobMatchRoutes from './routes/jobMatchRoutes.js';
import scoringRoutes from './routes/scoringRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getEnv, getEnvInt, isProduction } from './config/env.js';

const app = express();
const PORT = getEnvInt('PORT', 5000);
const NODE_ENV = getEnv('NODE_ENV', 'development');
const FRONTEND_URL = getEnv('FRONTEND_URL', 'http://localhost:5173');

// Security middleware
app.use(helmet());
app.disable('x-powered-by');

// CORS configuration
// app.use(cors({
//   origin: FRONTEND_URL,
//   credentials: true,
// }));

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
    },
    services: {
      database: process.env.SUPABASE_URL ? 'configured' : 'not configured',
      s3: process.env.AWS_S3_BUCKET ? 'configured' : 'not configured',
      ai: process.env.GROQ_API_KEY ? 'configured' : 'not configured',
    },
  };
  res.status(200).json(healthCheck);
});

// API routes
app.use('/api/resumes', resumeRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/jobs', jobMatchRoutes);
app.use('/api/scoring', scoringRoutes);

// Global error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Set a different PORT or stop the process using it.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});

const shutdown = (signal) => {
  console.info(`Received ${signal}. Shutting down server...`);
  server.close(() => {
    console.info('Server shutdown complete.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
