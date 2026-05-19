require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');
const session  = require('express-session');
const passport = require('passport');
const jwt      = require('jsonwebtoken');
const multer   = require('multer');
const db       = require('./db');

const app = express();

// ─────────────────────────────────────────
// FRONTEND PATH
// ─────────────────────────────────────────
const FRONTEND_DIR = path.resolve(__dirname, '../frontend');

// ─────────────────────────────────────────
// MULTER CONFIG #1: Certificates (existing - unchanged)
// ─────────────────────────────────────────
const certStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'certificates');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cert-' + unique + path.extname(file.originalname));
  }
});

const uploadCertificates = multer({
  storage: certStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB for certificates
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|png|jpg|jpeg|webp/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF/PNG/JPG/WEBP files are allowed for certificates'));
    }
  }
});

// ─────────────────────────────────────────
// MULTER CONFIG #2: Submissions
// ─────────────────────────────────────────
const subStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'submissions');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'sub-' + unique + path.extname(file.originalname));
  }
});

const uploadSubmissions = multer({
  storage: subStorage,
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.pdf', '.doc', '.docx'];
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext) && allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, or DOCX files are allowed for submissions'), false);
    }
  }
});

// Make uploads accessible to routes that need them
app.locals.uploadCertificates = uploadCertificates;
app.locals.uploadSubmissions   = uploadSubmissions;

// ─────────────────────────────────────────
// CORS
// ─────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'https://your-netlify-site.netlify.app'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─────────────────────────────────────────
// SESSION + PASSPORT
// ─────────────────────────────────────────
app.use(session({
  secret: process.env.JWT_SECRET || 'internsync_secret_key_123',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());

// ─────────────────────────────────────────
// GOOGLE STRATEGY
// ─────────────────────────────────────────
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy(
  {
    clientID    : process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : process.env.GOOGLE_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    console.log("🔥 GOOGLE STRATEGY HIT");

    try {
      const email    = profile.emails?.[0]?.value;
      const name     = profile.displayName;
      const googleId = profile.id;

      if (!email) return done(new Error("No email"), null);

      db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return done(err);

        if (results.length > 0) {
          const user = results[0];
          if (!user.google_id) {
            db.query('UPDATE users SET google_id = ? WHERE id = ?', [googleId, user.id]);
          }
          return done(null, user);
        }

        db.query(
          'INSERT INTO users (name, email, google_id, role) VALUES (?, ?, ?, ?)',
          [name, email, googleId, 'intern'],
          (err2, result) => {
            if (err2) return done(err2);
            db.query('SELECT * FROM users WHERE id = ?', [result.insertId], (err3, rows) => {
              if (err3) return done(err3);
              return done(null, rows[0]);
            });
          }
        );
      });

    } catch (error) {
      done(error, null);
    }
  }
));

// ─────────────────────────────────────────
// GOOGLE ROUTES
// ─────────────────────────────────────────
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/pages/auth.html?error=google_failed',
    session: false
  }),
  (req, res) => {
    try {
      const user  = req.user;
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'internsync_secret_key_123',
        { expiresIn: '7d' }
      );
      const params = new URLSearchParams({ token, id: user.id, name: user.name, role: user.role });
      res.redirect(`/pages/auth.html?${params.toString()}`);
    } catch (err) {
      res.redirect('/pages/auth.html?error=server_error');
    }
  }
);

// ─────────────────────────────────────────
// UPLOADS STATIC MIDDLEWARE (SINGLE — FIXED)
// Place this BEFORE API routes so files are
// accessible at /uploads/submissions/filename
// ─────────────────────────────────────────
app.use('/uploads', (req, res, next) => {
  // Prevent MIME sniffing attacks
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // ✅ REMOVED: Content-Security-Policy "default-src 'none'"
  // That header was blocking browsers from rendering PDF/DOC files inline.
  // X-Content-Type-Options alone is sufficient protection here.

  // Block dangerous executable file types from being served
  if (/\.(php|js|exe|sh|bat|phtml|pl|py|rb)$/i.test(req.path)) {
    return res.status(403).send('File type not allowed for direct access');
  }
  next();
}, express.static(path.join(__dirname, 'uploads')));

// ─────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/internchat',   require('./routes/internchat'));
app.use('/api/tasks',        require('./routes/tasks'));
app.use('/api/discussion',   require('./routes/discussion'));
app.use('/api/attendance',   require('./routes/attendance'));
app.use('/api/feedback',     require('./routes/feedback'));
app.use('/api/leave',        require('./routes/leave'));
app.use('/api/submissions',  require('./routes/submissions'));
app.use('/api/certificates', require('./routes/certificates'));

// ─────────────────────────────────────────
// MENTOR PROFILE ROUTES
// ─────────────────────────────────────────
const dbp = db.promise();

app.get('/api/mentor/profile', async (req, res) => {
  try {
    const [rows] = await dbp.query(
      'SELECT * FROM mentor_profile WHERE id = ?',
      ['MEN-770']
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const profile = rows[0];

    try {
      profile.expertise = JSON.parse(profile.expertise || '[]');
    } catch {
      profile.expertise = [];
    }

    res.json({ success: true, profile });
  } catch (err) {
    console.error('GET /api/mentor/profile error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/mentor/profile', async (req, res) => {
  const {
    name, role, company, email, phone,
    location, experience, expertise, photo_url
  } = req.body;

  try {
    await dbp.query(
      `UPDATE mentor_profile
       SET name=?, role=?, company=?, email=?, phone=?,
           location=?, experience=?, expertise=?, photo_url=?
       WHERE id=?`,
      [
        name, role, company, email, phone,
        location, experience,
        JSON.stringify(expertise || []),
        photo_url || '',
        'MEN-770'
      ]
    );

    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    console.error('PUT /api/mentor/profile error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────
// SERVE FRONTEND STATIC FILES
// ─────────────────────────────────────────
app.use(express.static(FRONTEND_DIR));

// ─────────────────────────────────────────
// GLOBAL ERROR HANDLER
// ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("🔴 Error:", err);
  if (req.path.startsWith('/api')) {
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
  res.status(500).send("Server error");
});

// ─────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running → http://localhost:${PORT}/pages/auth.html`);
});