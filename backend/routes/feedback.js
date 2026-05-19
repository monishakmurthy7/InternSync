// routes/feedback.js
// Mount in server.js: app.use('/api/feedback', require('./routes/feedback'));

const express = require('express');
const router  = express.Router();
const db      = require('../db');

const dbp = db.promise();

// ─────────────────────────────────────────
// HELPER — verify JWT and extract user
// ─────────────────────────────────────────
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'internsync_secret_key_123';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// ─────────────────────────────────────────
// GET /api/feedback
// Returns all feedback for a mentor (with intern name, role, color)
// Query params:
//   ?mentor_id=9        (filter by mentor; defaults to req.user.id if omitted)
//   ?intern_id=2        (filter by a specific intern)
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    // Accept mentor_id from query OR fall back to a default (9) for now
    // When auth is wired up, replace 9 with req.user.id
    const mentorId = req.query.mentor_id ? parseInt(req.query.mentor_id) : 9;

    let sql = `
      SELECT
        f.id,
        f.mentor_id,
        f.intern_id,
        u.name            AS intern_name,
        u.email           AS intern_email,
        f.message,
        f.rating,
        f.tags,
        f.improvements,
        f.efficiency,
        f.punctuality,
        f.code_quality    AS codeQuality,
        f.communication,
        f.created_at
      FROM feedback f
      JOIN users u ON u.id = f.intern_id
      WHERE f.mentor_id = ?
    `;
    const params = [mentorId];

    if (req.query.intern_id) {
      sql += ' AND f.intern_id = ?';
      params.push(parseInt(req.query.intern_id));
    }

    sql += ' ORDER BY f.created_at DESC';

    const [rows] = await dbp.query(sql, params);

    // Parse JSON columns safely
    const feedback = rows.map(r => ({
      ...r,
      tags:         safeJSON(r.tags,        []),
      improvements: safeJSON(r.improvements, []),
    }));

    res.json({ success: true, feedback });
  } catch (err) {
    console.error('GET /api/feedback error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────
// POST /api/feedback
// Body: { mentor_id, intern_id, message, rating,
//         tags[], improvements[], efficiency,
//         punctuality, codeQuality, communication }
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
  const {
    mentor_id,
    intern_id,
    message,
    rating,
    tags          = [],
    improvements  = [],
    efficiency    = 70,
    punctuality   = 80,
    codeQuality   = 75,
    communication = 72,
  } = req.body;

  // Basic validation
  if (!mentor_id || !intern_id || !message || !rating) {
    return res.status(400).json({
      success: false,
      message: 'mentor_id, intern_id, message and rating are required',
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be 1–5' });
  }

  try {
    const [result] = await dbp.query(
      `INSERT INTO feedback
        (mentor_id, intern_id, message, rating,
         tags, improvements,
         efficiency, punctuality, code_quality, communication,
         created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        mentor_id,
        intern_id,
        message,
        rating,
        JSON.stringify(tags),
        JSON.stringify(improvements),
        efficiency,
        punctuality,
        codeQuality,
        communication,
      ]
    );

    // Return the newly created row (with intern name for UI)
    const [[newRow]] = await dbp.query(
      `SELECT f.*, u.name AS intern_name, u.email AS intern_email
       FROM feedback f
       JOIN users u ON u.id = f.intern_id
       WHERE f.id = ?`,
      [result.insertId]
    );

    newRow.tags         = safeJSON(newRow.tags,        []);
    newRow.improvements = safeJSON(newRow.improvements, []);
    newRow.codeQuality  = newRow.code_quality;

    res.status(201).json({ success: true, feedback: newRow });
  } catch (err) {
    console.error('POST /api/feedback error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────
// GET /api/feedback/stats?mentor_id=9
// Returns aggregated stats for the stats row cards
// ─────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const mentorId = req.query.mentor_id ? parseInt(req.query.mentor_id) : 9;

    const [[stats]] = await dbp.query(
      `SELECT
         COUNT(*)                                      AS total,
         COUNT(DISTINCT intern_id)                     AS interns_covered,
         ROUND(AVG(rating), 1)                         AS avg_rating,
         SUM(created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS this_week
       FROM feedback
       WHERE mentor_id = ?`,
      [mentorId]
    );

    res.json({ success: true, stats });
  } catch (err) {
    console.error('GET /api/feedback/stats error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────
// UTIL
// ─────────────────────────────────────────
function safeJSON(val, fallback) {
  if (!val) return fallback;
  if (typeof val === 'object') return val; // already parsed by MySQL driver
  try { return JSON.parse(val); } catch { return fallback; }
}

module.exports = router;