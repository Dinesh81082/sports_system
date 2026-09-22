import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import teamsRouter from './routes/teams.js';
import playersRouter from './routes/players.js';
import coachesRouter from './routes/coaches.js';
import matchesRouter from './routes/matches.js';
import scoresRouter from './routes/scores.js';
import { dbService } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/teams', teamsRouter);
app.use('/api/players', playersRouter);
app.use('/api/coaches', coachesRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/scores', scoresRouter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: 'MongoDB (Mongoose)',
    connected: dbService.isOnline(),
    message: '⚽ Sports Management API is running!'
  });
});

// Vite middleware in dev or static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, host: '0.0.0.0' },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Sports Management Server running on http://0.0.0.0:${PORT}`);
});
