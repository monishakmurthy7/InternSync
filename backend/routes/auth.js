const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'internsync_secret_key_123';

// ─────────────────────────────
// EMAIL TRANSPORTER (Gmail)
// ─────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS
  }
});

// ─────────────────────────────
// IN-MEMORY OTP STORE
// ─────────────────────────────
const otpStore = {};

setInterval(() => {
  const now = Date.now();
  for (const email in otpStore) {
    if (now > otpStore[email].expires) {
      delete otpStore[email];
    }
  }
}, 15 * 60 * 1000);


// ─────────────────────────────
// REGISTER
// POST /api/auth/register
// ─────────────────────────────
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  const userRole = role === 'mentor' ? 'mentor' : 'intern';

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, userRole],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ success: true, message: "User registered successfully" });
        }
      );
    } catch (hashError) {
      return res.status(500).json({ error: "Password hashing failed" });
    }
  });
});


// ─────────────────────────────
// LOGIN
// POST /api/auth/login
// ─────────────────────────────
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = results[0];

    try {
      if (!user.password) {
        return res.status(400).json({ error: "This account uses Google login" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ id: user.id, name: user.name, role: user.role, token });

    } catch (compareError) {
      return res.status(500).json({ error: "Login failed" });
    }
  });
});


// ─────────────────────────────
// FORGOT PASSWORD — Sends OTP via Gmail
// POST /api/auth/forgot-password
// ─────────────────────────────
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.json({ message: "If that email exists, an OTP has been sent." });
    }

    const user = results[0];

    if (!user.password) {
      return res.json({ message: "If that email exists, an OTP has been sent." });
    }

    const otp     = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;

    otpStore[email] = {
      otp,
      userId:   user.id,
      expires,
      verified: false,
      attempts: 0
    };

    try {
      await transporter.sendMail({
        from:    `"InternSync" <${process.env.EMAIL_USER}>`,
        to:      email,
        subject: 'InternSync — Your OTP Code',
        html: `
          <div style="font-family:'Segoe UI',sans-serif;max-width:520px;margin:auto;
                      background:#1a1d0f;color:#fff;padding:48px 40px;border-radius:20px;">

            <div style="text-align:center;margin-bottom:32px;">
              <span style="font-family:Georgia,serif;font-size:42px;font-weight:bold;color:#fff;">I</span>
              <span style="font-family:Georgia,serif;font-size:42px;font-weight:bold;color:#d9a441;">S</span>
            </div>

            <h2 style="color:#d9a441;margin-bottom:8px;font-size:22px;">Password Reset OTP</h2>
            <p style="color:rgba(255,255,255,0.65);margin-bottom:28px;line-height:1.6;">
              You requested a password reset for your InternSync account.
              Use the code below — it expires in <strong style="color:#fff;">10 minutes</strong>.
            </p>

            <div style="background:rgba(217,164,65,0.12);border:1.5px solid rgba(217,164,65,0.5);
                        border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
              <div style="font-size:13px;color:rgba(255,255,255,0.4);letter-spacing:2px;
                          text-transform:uppercase;margin-bottom:12px;">Your OTP Code</div>
              <span style="font-size:44px;font-weight:bold;letter-spacing:14px;color:#d9a441;
                           font-family:'Courier New',monospace;">
                ${otp}
              </span>
            </div>

            <p style="color:rgba(255,255,255,0.4);font-size:13px;line-height:1.6;">
              Enter this code in the InternSync app to continue resetting your password.<br><br>
              If you didn't request this, you can safely ignore this email — your password won't change.
            </p>

            <div style="border-top:1px solid rgba(255,255,255,0.08);margin-top:32px;padding-top:20px;
                        text-align:center;color:rgba(255,255,255,0.25);font-size:11px;">
              © ${new Date().getFullYear()} InternSync · This is an automated message, please do not reply.
            </div>
          </div>
        `
      });

      res.json({ message: "OTP sent to your email." });

    } catch (mailErr) {
      delete otpStore[email];
      res.status(500).json({ error: "Failed to send OTP email. Please try again." });
    }
  });
});


// ─────────────────────────────
// VERIFY OTP
// POST /api/auth/verify-otp
// ─────────────────────────────
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required." });
  }

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ error: "No OTP was requested for this email. Please request a new one." });
  }

  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res.status(400).json({ error: "OTP has expired. Please request a new one." });
  }

  if (record.attempts >= 5) {
    delete otpStore[email];
    return res.status(400).json({ error: "Too many incorrect attempts. Please request a new OTP." });
  }

  if (record.otp !== otp.trim()) {
    otpStore[email].attempts += 1;
    const remaining = 5 - otpStore[email].attempts;
    return res.status(400).json({
      error: remaining > 0
        ? `Incorrect OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
        : 'Too many incorrect attempts. Please request a new OTP.'
    });
  }

  otpStore[email].verified = true;
  otpStore[email].attempts = 0;
  otpStore[email].expires  = Date.now() + 5 * 60 * 1000;

  res.json({ success: true, message: "OTP verified. You may now reset your password." });
});


// ─────────────────────────────
// RESET PASSWORD
// POST /api/auth/reset-password
// ─────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ error: "Session expired. Please start the reset process again." });
  }

  if (!record.verified) {
    return res.status(400).json({ error: "OTP not verified. Please verify your OTP first." });
  }

  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res.status(400).json({ error: "Session expired. Please start the reset process again." });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);

    db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashed, record.userId],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "User not found." });
        }

        delete otpStore[email];
        res.json({ success: true, message: "Password updated successfully! You can now login." });
      }
    );
  } catch (hashErr) {
    res.status(500).json({ error: "Failed to update password. Please try again." });
  }
});


module.exports = router;