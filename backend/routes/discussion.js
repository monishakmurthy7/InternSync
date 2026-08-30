const express = require('express');
const router  = express.Router();
const db      = require('../db');

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// ─────────────────────────────────────────────────────────────
// GET /api/discussion  — fetch all messages (newest last)
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const messages = await query(`
      SELECT id, sender_name, sender_photo, message, created_at
      FROM discussion_messages
      ORDER BY created_at ASC
      LIMIT 200
    `);
    res.json({ success: true, messages });
  } catch (err) {
    console.error('GET /discussion error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/discussion/poll?since=<ISO timestamp>
// Long-poll endpoint — returns messages newer than `since`
// ─────────────────────────────────────────────────────────────
router.get('/poll', async (req, res) => {
  const since = req.query.since || new Date(0).toISOString();
  try {
    const messages = await query(`
      SELECT id, sender_name, sender_photo, message, created_at
      FROM discussion_messages
      WHERE created_at > ?
      ORDER BY created_at ASC
    `, [since]);
    res.json({ success: true, messages });
  } catch (err) {
    console.error('GET /discussion/poll error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/discussion  — save a new message
// Body: { sender_name, sender_photo, message }
// ─────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { sender_name, sender_photo, message } = req.body;

  if (!sender_name || !message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'sender_name and message are required' });
  }

  try {
    const result = await query(
      `INSERT INTO discussion_messages (sender_name, sender_photo, message)
       VALUES (?, ?, ?)`,
      [sender_name.trim(), sender_photo || '', message.trim()]
    );

    // Return the full saved message so frontend can use DB timestamp
    const [saved] = await query(
      'SELECT id, sender_name, sender_photo, message, created_at FROM discussion_messages WHERE id = ?',
      [result.insertId]
    );

    console.log(`💬 [Discussion] ${sender_name}: ${message.trim().slice(0, 60)}`);
    res.json({ success: true, message: saved });

  } catch (err) {
    console.error('POST /discussion error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/discussion/:id  — delete a message (own messages)
// ─────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM discussion_messages WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /discussion/:id error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;