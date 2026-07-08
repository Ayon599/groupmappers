import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
const publicDir = path.join(__dirname, 'public');
const manifestPath = path.join(publicDir, 'assets', 'images', 'manifest.json');

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/^http:\/\/(localhost|127\.0\.0\.1|\[::1\]):\d+$/.test(origin)) return callback(null, true);
    if (/^http:\/\/(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}):\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked origin: ${origin}`));
  }
}));
app.use(morgan('dev'));
app.use('/assets', express.static(path.join(publicDir, 'assets'), {
  maxAge: '7d',
  etag: true
}));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'groupmappers-assets-api' });
});

app.get('/api/images', async (req, res) => {
  try {
    const manifest = await fs.readFile(manifestPath, 'utf8');
    res.json(JSON.parse(manifest));
  } catch {
    res.json([]);
  }
});

app.get('/api/site-map', async (req, res) => {
  try {
    const siteMap = await fs.readFile(path.join(publicDir, 'site-map.json'), 'utf8');
    res.json(JSON.parse(siteMap));
  } catch {
    res.json({ navigation: [], pages: {}, images: [] });
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
  console.log(`Images served from http://localhost:${port}/assets/images/`);
});
