// routes/certificates.js
const QRCode  = require('qrcode');
const path    = require('path');
const fs      = require('fs');
const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ─────────────────────────────────────────────────────────────────────────
// Multer middleware helper — pulled from app.locals (set once in server.js)
// ─────────────────────────────────────────────────────────────────────────
function uploadMiddleware(req, res, next) {
  const upload = req.app.locals.upload;
  upload.single('certificateFile')(req, res, err => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}

// ─────────────────────────────────────────────────────────────────────────
// POST /api/certificates — Create a new certificate
// ─────────────────────────────────────────────────────────────────────────
router.post('/', uploadMiddleware, async (req, res) => {
  const {
    internName, internId, domain,
    issueDate, startDate, endDate,
    note, signature1, signature2
  } = req.body;

  // Validate required fields
  if (!internName || !internId || !domain || !issueDate || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: internName, internId, domain, issueDate, startDate, endDate'
    });
  }

  const uploadedCertPath = req.file
    ? `/uploads/certificates/${req.file.filename}`
    : null;

  const insertSql = `
    INSERT INTO certificates
      (internName, internId, domain, issueDate, startDate, endDate, note,
       signature1_path, signature2_path, qr_code_path,
       uploaded_certificate_path, uploaded)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)
  `;

  const insertValues = [
    internName.trim(), internId.trim(), domain,
    issueDate, startDate, endDate, (note || '').trim(),
    signature1 || null, signature2 || null,
    uploadedCertPath,
    uploadedCertPath ? 1 : 0
  ];

  try {
    const [result] = await db.promise().query(insertSql, insertValues);

    if (!result.insertId) {
      return res.status(500).json({ success: false, message: 'Insert failed — no insertId returned' });
    }

    const certId    = result.insertId;
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5500'}/verify/certificate/${certId}`;

    // ── Generate QR code server-side ──────────────────────────────────
    try {
      const qrBuffer   = await QRCode.toBuffer(verifyUrl, {
        width:  300,
        margin: 2,
        color:  { dark: '#1a1d0f', light: '#ffffff' }
      });

      const qrFilename = `qr-${certId}-${Date.now()}.png`;
      const qrDir      = path.join(__dirname, '..', 'uploads', 'certificates', 'qrcodes');
      if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

      fs.writeFileSync(path.join(qrDir, qrFilename), qrBuffer);

      const qrDbPath = `/uploads/certificates/qrcodes/${qrFilename}`;

      await db.promise().query(
        'UPDATE certificates SET qr_code_path = ? WHERE id = ?',
        [qrDbPath, certId]
      );

      return res.status(201).json({
        success:        true,
        message:        'Certificate created successfully',
        certificate_id: certId,
        uploaded:       !!uploadedCertPath,
        qr_code_path:   qrDbPath      // ← frontend uses this to show the QR immediately
      });

    } catch (qrErr) {
      // QR failure is non-critical — certificate was already saved
      console.warn('⚠️ QR generation failed:', qrErr.message);
      return res.status(201).json({
        success:        true,
        message:        'Certificate created (QR generation failed)',
        certificate_id: certId,
        uploaded:       !!uploadedCertPath,
        qr_code_path:   null
      });
    }

  } catch (err) {
    console.error('🔴 DB Insert Error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'A certificate already exists for this intern on this date'
      });
    }
    return res.status(500).json({ success: false, message: 'Database error: ' + err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// GET /api/certificates — List all (with pagination + search)
// ─────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.min(50, parseInt(req.query.limit) || 8);
  const search = (req.query.search || '').trim();
  const offset = (page - 1) * limit;

  try {
    const params = [];
    let whereSql = '';

    if (search) {
      whereSql = ' WHERE internName LIKE ? OR internId LIKE ? OR domain LIKE ?';
      const s  = `%${search}%`;
      params.push(s, s, s);
    }

    const dataSql = `
      SELECT
        id, internName, internId, domain,
        issueDate, startDate, endDate, note,
        signature1_path, signature2_path, qr_code_path,
        uploaded_certificate_path, uploaded,
        created_at, updated_at
      FROM certificates
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.promise().query(dataSql, [...params, limit, offset]);

    const countSql    = `SELECT COUNT(*) AS total FROM certificates${whereSql}`;
    const [countRows] = await db.promise().query(countSql, params);
    const total       = countRows[0]?.total || 0;

    const formatted = rows.map(c => ({
      ...c,
      issueDate: c.issueDate ? new Date(c.issueDate).toISOString().split('T')[0] : null,
      startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : null,
      endDate:   c.endDate   ? new Date(c.endDate).toISOString().split('T')[0]   : null
    }));

    res.json({
      success: true,
      data:    formatted,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    console.error('🔴 DB Select Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// GET /api/certificates/:id — Fetch single certificate
// ─────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM certificates WHERE id = ?',
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    const cert = rows[0];
    res.json({
      success: true,
      data: {
        ...cert,
        issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : null,
        startDate: cert.startDate ? new Date(cert.startDate).toISOString().split('T')[0] : null,
        endDate:   cert.endDate   ? new Date(cert.endDate).toISOString().split('T')[0]   : null
      }
    });

  } catch (err) {
    console.error('🔴 DB Select Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// PUT /api/certificates/:id — Update certificate fields
// ─────────────────────────────────────────────────────────────────────────
router.put('/:id', uploadMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    internName, internId,
    internDomain,   // frontend sends "internDomain" for domain
    domain,         // also accept "domain" directly
    issueDate, startDate, endDate,
    note, signature1, signature2
  } = req.body;

  const resolvedDomain    = domain || internDomain;
  const uploadedCertPath  = req.file ? `/uploads/certificates/${req.file.filename}` : null;

  const sql = `
    UPDATE certificates
    SET
      internName                = COALESCE(?, internName),
      internId                  = COALESCE(?, internId),
      domain                    = COALESCE(?, domain),
      issueDate                 = COALESCE(?, issueDate),
      startDate                 = COALESCE(?, startDate),
      endDate                   = COALESCE(?, endDate),
      note                      = COALESCE(?, note),
      signature1_path           = COALESCE(?, signature1_path),
      signature2_path           = COALESCE(?, signature2_path),
      uploaded_certificate_path = COALESCE(?, uploaded_certificate_path),
      uploaded                  = IF(? IS NOT NULL, 1, uploaded),
      updated_at                = NOW()
    WHERE id = ?
  `;

  const values = [
    internName || null, internId || null, resolvedDomain || null,
    issueDate || null, startDate || null, endDate || null,
    note !== undefined ? note : null,
    signature1 || null, signature2 || null,
    uploadedCertPath, uploadedCertPath,
    id
  ];

  try {
    const [result] = await db.promise().query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    res.json({ success: true, message: 'Certificate updated successfully' });

  } catch (err) {
    console.error('🔴 DB Update Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// PATCH /api/certificates/:id/uploaded — Mark certificate as uploaded
// ─────────────────────────────────────────────────────────────────────────
router.patch('/:id/uploaded', async (req, res) => {
  try {
    const [result] = await db.promise().query(
      'UPDATE certificates SET uploaded = 1, updated_at = NOW() WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    res.json({ success: true, message: 'Certificate marked as uploaded' });

  } catch (err) {
    console.error('🔴 DB Update Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// POST /api/certificates/:id/upload — Upload certificate file
// ─────────────────────────────────────────────────────────────────────────
router.post('/:id/upload', uploadMiddleware, async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const certPath = `/uploads/certificates/${req.file.filename}`;

  try {
    const [result] = await db.promise().query(
      `UPDATE certificates
       SET uploaded_certificate_path = ?, uploaded = 1, updated_at = NOW()
       WHERE id = ?`,
      [certPath, id]
    );

    if (result.affectedRows === 0) {
      // Orphaned file — remove it
      fs.unlink(path.join(__dirname, '..', certPath), () => {});
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.json({
      success:   true,
      message:   'Certificate file uploaded successfully',
      file_path: certPath
    });

  } catch (err) {
    console.error('🔴 DB Update Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// DELETE /api/certificates/:id — Delete certificate and associated files
// ─────────────────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.promise().query(
      'SELECT uploaded_certificate_path, qr_code_path FROM certificates WHERE id = ?',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    const { uploaded_certificate_path, qr_code_path } = rows[0];

    await db.promise().query('DELETE FROM certificates WHERE id = ?', [id]);

    // Clean up associated files (non-blocking)
    [uploaded_certificate_path, qr_code_path].forEach(filePath => {
      if (!filePath) return;
      const abs = path.join(__dirname, '..', filePath);
      fs.unlink(abs, err => {
        if (err && err.code !== 'ENOENT') {
          console.warn('⚠️ Could not delete file:', abs, err.message);
        }
      });
    });

    res.json({ success: true, message: 'Certificate deleted successfully' });

  } catch (err) {
    console.error('🔴 DB Delete Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;