const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM internship_settings', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const settings = {};
    results.forEach(r => settings[r.setting_key] = r.setting_value);
    res.json(settings);
  });
});

module.exports = router;