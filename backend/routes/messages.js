// ─────────────────────────────────────────────────────────────────────────────
// routes/internchat.js  (renamed from messages.js)
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ── GET /api/internchat/:senderId/:receiverId ────────────────────────────────
// Fetch all messages between two users, oldest → newest
router.get('/:senderId/:receiverId', (req, res) => {
  const { senderId, receiverId } = req.params;

  const sql = `
    SELECT id, sender_id, receiver_id, message, sent_at
    FROM messages
    WHERE
      (sender_id = ? AND receiver_id = ?)
      OR
      (sender_id = ? AND receiver_id = ?)
    ORDER BY sent_at ASC
  `;

  db.query(sql, [senderId, receiverId, receiverId, senderId], (err, results) => {
    if (err) {
      console.error('GET /api/internchat error:', err.message);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    res.json(results);
  });
});

// ── POST /api/internchat/send ────────────────────────────────────────────────
// Save a new message to the DB
// Body: { sender_id, receiver_id, message }
router.post('/send', (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  if (!sender_id || !receiver_id || !message || !message.trim()) {
    return res.status(400).json({ error: 'sender_id, receiver_id and message are required.' });
  }

  const sql = `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`;

  db.query(sql, [sender_id, receiver_id, message.trim()], (err, result) => {
    if (err) {
      console.error('POST /api/internchat/send error:', err.message);
      return res.status(500).json({ error: 'Failed to save message' });
    }
    res.status(201).json({
      success   : true,
      message_id: result.insertId,
      sender_id,
      receiver_id,
      message   : message.trim(),
      sent_at   : new Date()
    });
  });
});

module.exports = router;