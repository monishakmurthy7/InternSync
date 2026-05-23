const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const db      = require('../db');

// ── Multer config ────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ✅ RESOLVE ABSOLUTE PATH: Goes up from 'routes/' to project root/server, then into 'uploads/submissions'
    const dir = path.resolve(__dirname, '../uploads/submissions');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    console.log(`💾 Multer saving to: ${dir}`); // DEBUG: Check this matches server.js output
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'sub-' + unique + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, or DOCX files are allowed.'), false);
    }
  }
});

function handleUpload(req, res, next) {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) return res.status(400).json({ error: 'Upload error: ' + err.message });
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}

// ── POST /submit ──────────────────────────────────────────
router.post('/submit', handleUpload, (req, res) => {
  const { intern_id, task_name, github_url } = req.body;
  if (!intern_id || !task_name) return res.status(400).json({ error: 'Intern ID and Task Name are required.' });

  // ✅ Store RELATIVE path for frontend URL
  const file_path = req.file ? path.join('uploads', 'submissions', path.basename(req.file.filename)).replace(/\\/g, '/') : null;
  const file_name = req.file ? req.file.originalname : 'no-file-uploaded';
  const safeGithub = github_url?.trim() || '';

  db.query(
    `INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, submitted_at)
     VALUES (?, ?, ?, ?, ?, 'on_time', NOW())`,
    [parseInt(intern_id), task_name.trim(), file_name, file_path, safeGithub],
    (err, result) => {
      if (err) {
        console.error('DB insert error:', err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlink(req.file.path, () => {});
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: 'Submitted successfully!',
        submission: {
          id: result.insertId,
          intern_id: parseInt(intern_id),
          task_name: task_name.trim(),
          file_name, file_path, github_url: safeGithub,
          status: 'on_time', feedback: null,
          submitted_at: new Date().toISOString()
        }
      });
    }
  );
});

// ── GET /intern/:id ───────────────────────────────────────
router.get('/intern/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid intern ID.' });

  db.query(
    `SELECT id, intern_id, task_name, file_name, file_path, github_url, status, feedback, submitted_at 
     FROM submissions WHERE intern_id = ? ORDER BY submitted_at DESC`,
    [id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// ── GET /all (mentor) ─────────────────────────────────────
router.get('/all', (req, res) => {
  db.query(
    `SELECT s.*, u.name AS intern_name FROM submissions s JOIN users u ON s.intern_id = u.id ORDER BY s.submitted_at DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// ── PUT /feedback/:id ─────────────────────────────────────
router.put('/feedback/:id', (req, res) => {
  const { feedback, status } = req.body;
  const valid = ['on_time', 'late'];
  const safeStatus = valid.includes(status) ? status : 'on_time';
  const safeFeedback = feedback?.trim() || '';
db.query('UPDATE submissions SET feedback = ?, status = ? WHERE id = ?',
  [safeFeedback, safeStatus, parseInt(req.params.id)], ...);

  db.query('UPDATE submissions SET feedback = ?, status = ? WHERE id = ?', [feedback.trim(), safeStatus, parseInt(req.params.id)], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Feedback saved!' });
  });
});

module.exports = router;