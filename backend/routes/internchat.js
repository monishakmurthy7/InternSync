const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/internchat/:senderId/:receiverId
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
    if (err) return res.status(500).json({ error: 'Failed to fetch messages' });
    res.json({ success: true, data: results });
  });
});

// POST /api/internchat/send
router.post('/send', (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  if (!sender_id || !receiver_id || !message?.trim()) {
    return res.status(400).json({ error: 'sender_id, receiver_id and message are required.' });
  }
  const sql = `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`;
  db.query(sql, [sender_id, receiver_id, message.trim()], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to save message' });
    res.status(201).json({
      success    : true,
      message_id : result.insertId,
      sender_id,
      receiver_id,
      message    : message.trim(),
      sent_at    : new Date()
    });
  });
});

module.exports = router;