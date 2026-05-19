const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ── GET all leaves for mentor (with intern name from JOIN) ──
router.get('/all', (req, res) => {
  db.query(
    `SELECT lr.*, u.name AS intern_name
     FROM leave_requests lr
     JOIN users u ON lr.intern_id = u.id
     ORDER BY lr.created_at DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// ── GET leave history for one intern ──
router.get('/intern/:id', (req, res) => {
  db.query(
    `SELECT * FROM leave_requests 
     WHERE intern_id = ? 
     ORDER BY created_at DESC`,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// ── GET summary counts for one intern ──
router.get('/summary/:id', (req, res) => {
  db.query(
    `SELECT
       COUNT(*)                      AS total,
       SUM(status = 'approved')      AS approved,
       SUM(status = 'pending')       AS pending,
       SUM(status = 'rejected')      AS rejected
     FROM leave_requests
     WHERE intern_id = ?`,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0]);
    }
  );
});

// ── POST apply for leave ──
router.post('/apply', (req, res) => {
  const { intern_id, leave_type, reason, from_date, to_date } = req.body;

  if (!intern_id || !leave_type || !reason || !from_date || !to_date) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (new Date(to_date) < new Date(from_date)) {
    return res.status(400).json({ error: 'End date cannot be before start date.' });
  }

  db.query(
    `INSERT INTO leave_requests 
       (intern_id, leave_type, reason, leave_date, from_date, to_date, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
    [intern_id, leave_type, reason, from_date, from_date, to_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Leave applied!', id: result.insertId });
    }
  );
});

// ── PUT approve / reject (mentor) ──
router.put('/status/:id', (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }
  db.query(
    'UPDATE leave_requests SET status = ? WHERE id = ?',
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Status updated!' });
    }
  );
});

module.exports = router;