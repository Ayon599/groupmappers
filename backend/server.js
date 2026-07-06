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
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
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

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
  console.log(`Images served from http://localhost:${port}/assets/images/`);
});
