const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');
const db      = require('../db');

const dbp = db.promise();

// Resume files live in: backend/uploads/resumes/
const RESUME_DIR = path.join(__dirname, '..', 'uploads', 'resumes');

// ─────────────────────────────────────────────────────────────
// GET /api/interns
// Returns all interns ordered by name
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await dbp.query(
      `SELECT * FROM interns ORDER BY name ASC`
    );
    // Parse JSON skills field
    const data = rows.map(r => ({
      ...r,
      skills: typeof r.skills === 'string' ? JSON.parse(r.skills) : (r.skills || [])
    }));
    res.json({ success: true, data });
  } catch (err) {
    console.error('GET /interns error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/interns/:id
// Returns a single intern by id
// ─────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await dbp.query(
      `SELECT * FROM interns WHERE id = ?`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    const r = rows[0];
    r.skills = typeof r.skills === 'string' ? JSON.parse(r.skills) : (r.skills || []);
    res.json({ success: true, data: r });
  } catch (err) {
    console.error('GET /interns/:id error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/interns/:id/resume
// Streams the intern's resume PDF for viewing in the browser
// ─────────────────────────────────────────────────────────────
router.get('/:id/resume', async (req, res) => {
  try {
    const [rows] = await dbp.query(
      `SELECT name, resume_file FROM interns WHERE id = ?`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Intern not found' });

    const { resume_file } = rows[0];
    if (!resume_file) return res.status(404).json({ success: false, message: 'No resume on file' });

    const filePath = path.join(RESUME_DIR, resume_file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Resume file not found on server' });
    }

    // Serve inline so browser opens PDF viewer (not download)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${resume_file}"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error('GET /interns/:id/resume error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PUT /api/interns/:id
// Update an intern's mutable fields (pct, status, tasks, etc.)
// ─────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { pct, status, tasks_total, tasks_done, skills, summary } = req.body;
  try {
    await dbp.query(
      `UPDATE interns
       SET pct = COALESCE(?, pct),
           status = COALESCE(?, status),
           tasks_total = COALESCE(?, tasks_total),
           tasks_done = COALESCE(?, tasks_done),
           skills = COALESCE(?, skills),
           summary = COALESCE(?, summary)
       WHERE id = ?`,
      [
        pct ?? null,
        status ?? null,
        tasks_total ?? null,
        tasks_done ?? null,
        skills ? JSON.stringify(skills) : null,
        summary ?? null,
        req.params.id
      ]
    );
    res.json({ success: true, message: 'Intern updated' });
  } catch (err) {
    console.error('PUT /interns/:id error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/interns/seed
// One-time seed of all 10 interns into the DB.
// Call once from browser console on localhost:3000.
// ─────────────────────────────────────────────────────────────
router.post('/seed', async (req, res) => {
  const SEED = [
    {
      name:'Monisha K', role:'Full Stack Intern', track:'fullstack',
      email:'monisha.k@ibm-intern.in', phone:'+91 98401 12345',
      location:'Chennai, Tamil Nadu',
      college:'Sri Sivasubramaniya Nadar College of Engineering',
      degree:'B.E. Computer Science and Engineering',
      study_year:'3rd Year (2022–2026)', cgpa:'8.7',
      linkedin:'linkedin.com/in/monishak', github:'github.com/monishak',
      photo_url:'/images/monisha.jpeg',
      resume_file:'Monisha_K_Resume.pdf',
      skills:['HTML','CSS','JavaScript','React','Node.js','MySQL'],
      pct:62, status:'active', tasks_total:5, tasks_done:3,
      color:'#d9a441',
      summary:'Passionate Full Stack Developer with hands-on experience in React and Node.js. Currently interning at InternSync (IBM SkillsBuild) focusing on database optimisation and scalable web architectures.',
    },
    {
      name:'Fiona Shalet', role:'Frontend Intern', track:'frontend',
      email:'fiona.shalet@ibm-intern.in', phone:'+91 94455 67890',
      location:'Kochi, Kerala',
      college:'College of Engineering Trivandrum',
      degree:'B.Tech Information Technology',
      study_year:'3rd Year (2022–2026)', cgpa:'9.1',
      linkedin:'linkedin.com/in/fionashalet', github:'github.com/fionashalet',
      photo_url:'/images/fiona.jpeg',
      resume_file:'Fiona_Shalet_Resume.pdf',
      skills:['HTML','CSS','Tailwind','React','Figma','TypeScript'],
      pct:78, status:'active', tasks_total:6, tasks_done:5,
      color:'#2dd4bf',
      summary:'Creative Frontend Developer with strong proficiency in React and TypeScript. Passionate about pixel-perfect UI design and accessibility.',
    },
    {
      name:'Stella Mary', role:'Backend Intern', track:'backend',
      email:'stella.mary@ibm-intern.in', phone:'+91 90001 23456',
      location:'Coimbatore, Tamil Nadu',
      college:'PSG College of Technology',
      degree:'B.E. Electronics and Communication Engineering',
      study_year:'3rd Year (2022–2026)', cgpa:'7.8',
      linkedin:'linkedin.com/in/stellamary', github:'github.com/stellamary',
      photo_url:'/images/stella.jpeg',
      resume_file:'Stella_Mary_Resume.pdf',
      skills:['Node.js','Express','PHP','MySQL','REST APIs','JWT'],
      pct:45, status:'behind', tasks_total:4, tasks_done:2,
      color:'#ff6b6b',
      summary:'Backend Developer Intern with focus on PHP, Node.js and REST API development. Currently building microservice modules for InternSync.',
    },
    {
      name:'Bhavana R', role:'Full Stack Intern', track:'fullstack',
      email:'bhavana.r@ibm-intern.in', phone:'+91 87654 32100',
      location:'Bengaluru, Karnataka',
      college:'RV College of Engineering',
      degree:'B.E. Computer Science and Engineering',
      study_year:'3rd Year (2022–2026)', cgpa:'9.3',
      linkedin:'linkedin.com/in/bhavanar', github:'github.com/bhavanar',
      photo_url:'/images/bhavana.jpeg',
      resume_file:'Bhavana_R_Resume.pdf',
      skills:['HTML','CSS','JavaScript','React','MongoDB','Python'],
      pct:85, status:'active', tasks_total:6, tasks_done:5,
      color:'#4ade80',
      summary:'Top-performing Full Stack Intern consistently delivering ahead of schedule. Designed the MySQL Schema for InternSync\'s task management module.',
    },
    {
      name:'Deekshitha S', role:'UI/UX Intern', track:'frontend',
      email:'deekshitha.s@ibm-intern.in', phone:'+91 99887 65432',
      location:'Mysuru, Karnataka',
      college:'JSS Science and Technology University',
      degree:'B.E. Information Science and Engineering',
      study_year:'3rd Year (2022–2026)', cgpa:'8.2',
      linkedin:'linkedin.com/in/deekshithas', github:'github.com/deekshithas',
      photo_url:'/images/deekshitha.jpeg',
      resume_file:'Deekshitha_S_Resume.pdf',
      skills:['Figma','Adobe XD','HTML','CSS','Prototyping'],
      pct:55, status:'active', tasks_total:5, tasks_done:3,
      color:'#c084fc',
      summary:'UI/UX Design Intern with a keen eye for user-centred design. Proficient in Figma and Adobe XD, with experience prototyping and conducting usability tests.',
    },
    {
      name:'Arun Prasad', role:'Backend Intern', track:'backend',
      email:'arun.prasad@ibm-intern.in', phone:'+91 91234 56789',
      location:'Madurai, Tamil Nadu',
      college:'Thiagarajar College of Engineering',
      degree:'B.E. Computer Science and Engineering',
      study_year:'4th Year (2021–2025)', cgpa:'8.5',
      linkedin:'linkedin.com/in/arunprasad', github:'github.com/arunprasad',
      photo_url:'/images/arun.jpeg',
      resume_file:'Arun_Prasad_Resume.pdf',
      skills:['PHP','MySQL','Python','Django','REST APIs','Redis'],
      pct:70, status:'active', tasks_total:5, tasks_done:4,
      color:'#fbbf24',
      summary:'Experienced Backend Developer Intern with strong skills in Python, Django and Redis. Delivered the Django API module for InternSync\'s task assignment system.',
    },
    {
      name:'Shonn Dias', role:'Full Stack Intern', track:'fullstack',
      email:'shonn.dias@ibm-intern.in', phone:'+91 77788 99001',
      location:'Goa',
      college:'Goa College of Engineering',
      degree:'B.Tech Computer Engineering',
      study_year:'3rd Year (2022–2026)', cgpa:'7.2',
      linkedin:'linkedin.com/in/shonndias', github:'github.com/shonndias',
      photo_url:'/images/shonn.jpeg',
      resume_file:'Shonn_Dias_Resume.pdf',
      skills:['JavaScript','Vue.js','Node.js','PostgreSQL','Docker'],
      pct:38, status:'risk', tasks_total:4, tasks_done:2,
      color:'#38bdf8',
      summary:'Full Stack Intern with experience in Vue.js and Docker. Keen on DevOps and containerisation. Currently working on PostgreSQL integrations for InternSync.',
    },
    {
      name:'Bhoomika Ravi', role:'Frontend Intern', track:'frontend',
      email:'bhoomika.ravi@ibm-intern.in', phone:'+91 96543 21098',
      location:'Bengaluru, Karnataka',
      college:'M S Ramaiah Institute of Technology',
      degree:'B.E. Computer Science and Engineering',
      study_year:'3rd Year (2022–2026)', cgpa:'9.4',
      linkedin:'linkedin.com/in/bhoomika-ravi', github:'github.com/bhoomika-ravi',
      photo_url:'/images/bhoomika.jpeg',
      resume_file:'Bhoomika_Ravi_Resume.pdf',
      skills:['React','TypeScript','CSS','Sass','Jest','Webpack'],
      pct:91, status:'active', tasks_total:6, tasks_done:6,
      color:'#fb7185',
      summary:'Top-ranked Frontend Intern with exceptional React and TypeScript skills. Completed all assigned tasks and additionally conducted peer reviews.',
    },
    {
      name:'Hrithika Gowda', role:'Backend Intern', track:'backend',
      email:'hrithika.gowda@ibm-intern.in', phone:'+91 82345 67890',
      location:'Bengaluru, Karnataka',
      college:'BMS College of Engineering',
      degree:'B.E. Computer Science and Engineering',
      study_year:'3rd Year (2022–2026)', cgpa:'7.9',
      linkedin:'linkedin.com/in/hrithikagowda', github:'github.com/hrithikagowda',
      photo_url:'/images/hrithika.jpeg',
      resume_file:'Hrithika_Gowda_Resume.pdf',
      skills:['Java','Spring Boot','MySQL','AWS','REST APIs'],
      pct:50, status:'behind', tasks_total:4, tasks_done:2,
      color:'#818cf8',
      summary:'Backend Developer Intern specialising in Java and Spring Boot. Building REST services and exploring AWS cloud deployment for InternSync.',
    },
    {
      name:'Vinay Kumar', role:'Full Stack Intern', track:'fullstack',
      email:'vinay.kumar@ibm-intern.in', phone:'+91 93456 78901',
      location:'Hyderabad, Telangana',
      college:'JNTUH College of Engineering',
      degree:'B.Tech Computer Science and Engineering',
      study_year:'3rd Year (2022–2026)', cgpa:'8.0',
      linkedin:'linkedin.com/in/vinaykumar', github:'github.com/vinaykumar',
      photo_url:'/images/vinay.jpeg',
      resume_file:'Vinay_Kumar_Resume.pdf',
      skills:['HTML','CSS','React','Node.js','GraphQL','MongoDB'],
      pct:74, status:'active', tasks_total:5, tasks_done:4,
      color:'#2dd4bf',
      summary:'Full Stack Intern with modern JavaScript expertise, building GraphQL APIs and MongoDB integrations for InternSync.',
    },
  ];

  try {
    for (const intern of SEED) {
      await dbp.query(
        `INSERT INTO interns
          (name, role, track, email, phone, location, college, degree,
           study_year, cgpa, linkedin, github, photo_url, resume_file,
           skills, pct, status, tasks_total, tasks_done, color, summary)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE
           role=VALUES(role), track=VALUES(track), phone=VALUES(phone),
           location=VALUES(location), college=VALUES(college),
           degree=VALUES(degree), study_year=VALUES(study_year),
           cgpa=VALUES(cgpa), linkedin=VALUES(linkedin),
           github=VALUES(github), photo_url=VALUES(photo_url),
           resume_file=VALUES(resume_file), skills=VALUES(skills),
           pct=VALUES(pct), status=VALUES(status),
           tasks_total=VALUES(tasks_total), tasks_done=VALUES(tasks_done),
           color=VALUES(color), summary=VALUES(summary)`,
        [
          intern.name, intern.role, intern.track,
          intern.email, intern.phone, intern.location,
          intern.college, intern.degree, intern.study_year,
          intern.cgpa, intern.linkedin, intern.github,
          intern.photo_url, intern.resume_file,
          JSON.stringify(intern.skills),
          intern.pct, intern.status,
          intern.tasks_total, intern.tasks_done,
          intern.color, intern.summary
        ]
      );
    }
    res.json({ success: true, message: `Seeded ${SEED.length} interns` });
  } catch (err) {
    console.error('POST /interns/seed error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;