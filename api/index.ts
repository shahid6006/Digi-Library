import express, { type Request, type Response, type NextFunction } from 'express';
import { setupApiRoutes } from '../server/routes.ts';
import { seedInitialDataIfNeeded } from '../server/db.ts';

const app = express();
app.use(express.json());

// Enable CORS
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-timezone');
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Seed sample records on initial cold start if fresh database
try {
  seedInitialDataIfNeeded();
} catch (err) {
  console.error('[Vercel Serverless] Initial DB seed error:', err);
}

// Mount all API routes
setupApiRoutes(app);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: 'vercel',
    time: new Date().toISOString(),
  });
});

export default app;
