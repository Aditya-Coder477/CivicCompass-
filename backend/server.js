require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

function safeRequire(path) {
  try { return require(path); }
  catch (e) { console.error(`[server] Failed to load route: ${path}\n`, e); return null; }
}

const journeyRoute        = safeRequire('./src/routes/journey');
const nextStepsRoute      = safeRequire('./src/routes/nextSteps');
const timelineRoute       = safeRequire('./src/routes/timeline');
const explainRoute        = safeRequire('./src/routes/explain');
const mythFactRoute       = safeRequire('./src/routes/mythFact');
const checklistRoute      = safeRequire('./src/routes/checklist');
const boothLocatorRoute   = safeRequire('./src/routes/boothLocator');
const simulateVotingRoute = safeRequire('./src/routes/simulateVoting');

const app = express();
const PORT = process.env.PORT || 8080;

// ── Security & middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10kb' }));

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  /\.run\.app$/,   // allow all Cloud Run URLs
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    cb(allowed ? null : new Error('CORS blocked'), allowed);
  },
  credentials: true,
}));

// ── Rate limiting ──────────────────────────────────────────────────────────────
app.use('/api/', rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again shortly.' },
}));

// ── Routes ─────────────────────────────────────────────────────────────────────
function mountRoute(path, route) {
  if (route) {
    app.use(path, route);
  } else {
    app.use(path, (_req, res) => res.status(500).json({ error: `Route ${path} failed to load. Check server logs.` }));
    console.error(`[server] Route ${path} is null — it failed to load at startup.`);
  }
}

mountRoute('/api/journey',         journeyRoute);
mountRoute('/api/next-steps',      nextStepsRoute);
mountRoute('/api/timeline',        timelineRoute);
mountRoute('/api/explain',         explainRoute);
mountRoute('/api/myth-fact',       mythFactRoute);
mountRoute('/api/checklist',       checklistRoute);
mountRoute('/api/booth-locator',   boothLocatorRoute);
mountRoute('/api/simulate-voting', simulateVotingRoute);

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', version: '1.0.0', phase: 1 }));

// ── 404 ────────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Endpoint not found' }));

// ── Error handler ──────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  console.error(`[ERROR] ${err.message}`);
  res.status(status).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`CivicCompass backend running on port ${PORT}`);
});

module.exports = app;
