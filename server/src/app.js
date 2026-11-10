const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Jika CORS_ORIGIN kosong (mode dev), semua origin diizinkan
app.use(cors(allowedOrigins.length > 0 ? { origin: allowedOrigins } : {}));
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  return res.status(200).json({ status: 'ok' });
});

app.use('/api/v1/auth', authRoutes);

module.exports = app;
