/**
 * ScanMyQr Backend - Express API with NeonDB
 * Port: 5000 (or PORT from env)
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());

// NeonDB client (lazy init to avoid connection errors at startup if DATABASE_URL missing)
function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set in .env');
  return neon(url);
}

// ----- Validation helpers -----
function sanitizeString(str, maxLen = 255) {
  if (typeof str !== 'string') return null;
  return str.trim().slice(0, maxLen) || null;
}

function validateProfile(body) {
  const name = sanitizeString(body.name, 255);
  if (!name) return { error: 'Name is required', status: 400 };
  return {
    name,
    location: sanitizeString(body.location, 255),
    phone: sanitizeString(body.phone, 50),
    whatsapp: sanitizeString(body.whatsapp, 50),
    bio: body.bio != null ? sanitizeString(String(body.bio), 2000) : null,
  };
}

// ----- API Routes -----

/**
 * GET /api/health
 * Health check for load balancers / monitoring
 */
app.get('/api/health', async (req, res) => {
  try {
    const sql = getDb();
    await sql`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected', message: err.message });
  }
});

/**
 * POST /api/profiles
 * Create a new profile. Returns { id }.
 */
app.post('/api/profiles', async (req, res) => {
  try {
    const validated = validateProfile(req.body);
    if (validated.error) {
      return res.status(validated.status).json({ error: validated.error });
    }
    const sql = getDb();
    const rows = await sql`
      INSERT INTO user_profiles (name, location, phone, whatsapp, bio)
      VALUES (${validated.name}, ${validated.location}, ${validated.phone}, ${validated.whatsapp}, ${validated.bio})
      RETURNING id
    `;
    const id = rows[0]?.id;
    if (!id) return res.status(500).json({ error: 'Failed to create profile' });
    res.status(201).json({ id: String(id) });
  } catch (err) {
    console.error('POST /api/profiles', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

/**
 * GET /api/profiles/:id
 * Get a single profile by ID.
 */
app.get('/api/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, location, phone, whatsapp, bio, created_at
      FROM user_profiles
      WHERE id = ${id}::uuid
    `;
    if (!rows.length) return res.status(404).json({ error: 'Profile not found' });
    const row = rows[0];
    res.json({
      id: String(row.id),
      name: row.name,
      location: row.location,
      phone: row.phone,
      whatsapp: row.whatsapp,
      bio: row.bio,
      created_at: row.created_at,
    });
  } catch (err) {
    console.error('GET /api/profiles/:id', err);
    if (err.message && err.message.includes('invalid input syntax for type uuid')) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

/**
 * GET /api/profiles
 * List all profiles (optional).
 */
app.get('/api/profiles', async (req, res) => {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, location, phone, whatsapp, bio, created_at
      FROM user_profiles
      ORDER BY created_at DESC
    `;
    res.json(
      rows.map((row) => ({
        id: String(row.id),
        name: row.name,
        location: row.location,
        phone: row.phone,
        whatsapp: row.whatsapp,
        bio: row.bio,
        created_at: row.created_at,
      }))
    );
  } catch (err) {
    console.error('GET /api/profiles', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// ----- Error handling middleware -----
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// ----- Start server -----
app.listen(PORT, () => {
  console.log(`ScanMyQr API running at http://localhost:${PORT}`);
});
