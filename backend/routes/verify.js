// routes/verify.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Public endpoint to verify certificate by ID
router.get('/certificate/:id', (req, res) => {
  const { id } = req.params;
  
  db.query(
    `SELECT 
      id, internName, internId, domain, issueDate, startDate, endDate, note,
      uploaded_certificate_path, uploaded, created_at
     FROM certificates WHERE id = ?`,
    [id],
    (err, results) => {
      if (err) {
        console.error('Verification DB Error:', err);
        return res.status(500).json({ success: false, message: 'Verification failed' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'Certificate not found' });
      }
      
      const cert = results[0];
      
      // Return JSON for API calls
      if (req.headers.accept?.includes('application/json')) {
        return res.json({
          success: true,
          verified: true,
          data: {
            ...cert,
            issueDate: cert.issueDate?.toISOString?.()?.split('T')[0] || cert.issueDate,
            startDate: cert.startDate?.toISOString?.()?.split('T')[0] || cert.startDate,
            endDate: cert.endDate?.toISOString?.()?.split('T')[0] || cert.endDate
          }
        });
      }
      
      // Return HTML page for browser/QR scan
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Certificate Verified ✓</title>
          <style>
            body { 
              font-family: 'Inter', system-ui, sans-serif; 
              background: linear-gradient(135deg, #1a1d0f 0%, #2d331a 100%);
              color: #f0ede4; 
              margin: 0; 
              padding: 20px;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .card {
              background: rgba(255,255,255,0.08);
              border: 1px solid rgba(217,164,65,0.3);
              border-radius: 16px;
              padding: 32px;
              max-width: 600px;
              width: 100%;
              backdrop-filter: blur(10px);
              box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            }
            .verified-badge {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: rgba(45,212,191,0.15);
              border: 1px solid rgba(45,212,191,0.4);
              color: #2dd4bf;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: 600;
              font-size: 14px;
              margin-bottom: 24px;
            }
            .cert-title {
              font-family: 'Playfair Display', serif;
              font-size: 28px;
              font-weight: 700;
              margin: 0 0 8px 0;
              color: #d9a441;
            }
            .cert-subtitle {
              color: rgba(240,237,228,0.7);
              margin: 0 0 24px 0;
              font-size: 14px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { color: rgba(240,237,228,0.6); font-size: 13px; }
            .detail-value { font-weight: 600; font-size: 14px; text-align: right; }
            .cert-id {
              background: rgba(217,164,65,0.1);
              padding: 4px 12px;
              border-radius: 6px;
              font-family: monospace;
              font-size: 12px;
            }
            .footer {
              margin-top: 32px;
              padding-top: 20px;
              border-top: 1px solid rgba(255,255,255,0.1);
              text-align: center;
              font-size: 12px;
              color: rgba(240,237,228,0.5);
            }
            .footer a { color: #d9a441; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="verified-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              ✓ Certificate Verified
            </div>
            
            <h1 class="cert-title">Certificate of Achievement</h1>
            <p class="cert-subtitle">IBM SkillsBuild × InternSync Virtual Internship</p>
            
            <div class="detail-row">
              <span class="detail-label">Intern Name</span>
              <span class="detail-value">${cert.internName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Intern ID</span>
              <span class="detail-value">${cert.internId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Domain</span>
              <span class="detail-value">${cert.domain}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Issue Date</span>
              <span class="detail-value">${new Date(cert.issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Program Period</span>
              <span class="detail-value">${new Date(cert.startDate).toLocaleDateString('en-GB')} — ${new Date(cert.endDate).toLocaleDateString('en-GB')}</span>
            </div>
            ${cert.note ? `
            <div class="detail-row" style="flex-direction: column; align-items: flex-start; gap: 8px;">
              <span class="detail-label">Achievement Note</span>
              <span class="detail-value" style="text-align: left; font-weight: 400;">${cert.note}</span>
            </div>` : ''}
            
            <div style="margin-top: 24px; text-align: center;">
              <span class="cert-id">Certificate ID: IS-IBM-2026-${cert.id}</span>
            </div>
            
            <div class="footer">
              Verified via InternSync • 
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5500'}">Return to Platform</a>
            </div>
          </div>
        </body>
        </html>
      `);
    }
  );
});

module.exports = router;