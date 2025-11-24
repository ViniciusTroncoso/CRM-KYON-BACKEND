import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Routes
import authRoutes from './routes/auth.routes';
import teamRoutes from './routes/team.routes';
import leadsRoutes from './routes/leads.routes';
import sdrLogsRoutes from './routes/sdr-logs.routes';
import marketingRoutes from './routes/marketing.routes';
import metaAuthRoutes from './routes/meta-auth.routes';
import activityLogsRoutes from './routes/activity-logs.routes';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://crm-interno-kyon-production.up.railway.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'CRM Kyon Backend'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/sdr-logs', sdrLogsRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/activity-logs', activityLogsRoutes);
app.use('/auth/meta', metaAuthRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(port, () => {
  console.log(`🚀 CRM Kyon Backend running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
