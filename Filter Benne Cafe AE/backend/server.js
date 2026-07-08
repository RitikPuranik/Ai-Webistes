const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const menuRoutes = require('./routes/menu');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const frontendUrls = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(url => url.trim()) : [];
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', ...frontendUrls];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu', menuRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);


      // ── Keep-alive: self-ping every 4 minutes to prevent idle shutdown ──
      const KEEP_ALIVE_INTERVAL = 4 * 60 * 1000; // 4 minutes in ms
      const backendUrl = process.env.BACKEND_URL;

      if (backendUrl) {
        const client = backendUrl.startsWith('https') ? require('https') : require('http');

        setInterval(() => {
          client
            .get(backendUrl, (res) => {
              console.log(`[Keep-Alive] Pinged ${backendUrl} — Status: ${res.statusCode}`);
            })
            .on('error', (err) => {
              console.error(`[Keep-Alive] Ping failed:`, err.message);
            });
        }, KEEP_ALIVE_INTERVAL);

        console.log(`[Keep-Alive] Self-ping scheduled every 4 minutes → ${backendUrl}`);
      } else {
        console.warn('[Keep-Alive] BACKEND_URL not set in .env — skipping self-ping');
      }
    });
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  });


