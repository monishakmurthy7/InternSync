USE internsync;

-- Table to store approved mentor credentials
CREATE TABLE IF NOT EXISTS mentor_codes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(150) NOT NULL UNIQUE,
  code       VARCHAR(100) NOT NULL,
  used       TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pre-approved mentor: only this email + code combo works
SELECT * FROM users;

CREATE TABLE IF NOT EXISTS mentor_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(100) NOT NULL
);
INSERT INTO mentor_codes (email, code) VALUES ('rajsharma@gmail.com', 'men_770');
-- First check what's in the users table
SELECT id, name, email, role FROM users;
UPDATE users 
SET password = '$2b$10$FrQGNAxgM.3fwo21HLc7ee1tbcL/VgtW0fqQIXFXWsGRPxUHqJn.6' 
WHERE email = 'rajsharma@gmail.com';
SELECT email, role, LEFT(password,20) as pw_preview FROM users;
DELETE FROM users WHERE email = 'rajsharma@gmail.com';
SHOW TABLES;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to INT,
  assigned_by INT,
  due_date DATE,
  status ENUM('pending','completed') DEFAULT 'pending',
  is_today TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  intern_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present','absent') DEFAULT 'present',
  UNIQUE KEY unique_attendance (intern_id, date)
);

CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mentor_id INT NOT NULL,
  intern_id INT NOT NULL,
  message TEXT NOT NULL,
  rating INT DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT id, name, email, role FROM users;
-- Test tasks
-- Tasks
INSERT INTO tasks (title, description, assigned_to, assigned_by, due_date, status, is_today)
VALUES 
('Build Login Page UI', 'Using HTML and CSS', 2, 9, '2026-04-15', 'completed', 0),
('Auth Flow Setup', 'JWT and bcrypt', 2, 9, '2026-04-16', 'completed', 0),
('DB Schema Design', 'MySQL tables', 2, 9, '2026-04-17', 'completed', 0),
('Dashboard UI', 'Build the dashboard', 2, 9, '2026-04-20', 'pending', 1),
('API Integration', 'Connect frontend to backend', 2, 9, '2026-04-22', 'pending', 0);

-- Attendance
INSERT INTO attendance (intern_id, date, status) VALUES
(2, '2026-04-01', 'present'),
(2, '2026-04-02', 'present'),
(2, '2026-04-03', 'absent'),
(2, '2026-04-04', 'present'),
(2, '2026-04-05', 'present');

-- Feedback
INSERT INTO feedback (mentor_id, intern_id, message, rating) VALUES
(9, 2, 'Great work on the login UI. Very clean design.', 5),
(9, 2, 'Improve responsiveness on mobile devices.', 4);

-- Clear old bad data first
DELETE FROM tasks;
DELETE FROM attendance;
DELETE FROM feedback;

-- Insert tasks (Monisha=2, Raj Sharma=9)
INSERT INTO tasks (title, description, assigned_to, assigned_by, due_date, status, is_today) VALUES 
('Build Login Page UI', 'Using HTML and CSS', 2, 9, '2026-04-15', 'completed', 0),
('Auth Flow Setup', 'JWT and bcrypt', 2, 9, '2026-04-16', 'completed', 0),
('DB Schema Design', 'MySQL tables', 2, 9, '2026-04-17', 'completed', 0),
('Dashboard UI', 'Build the dashboard', 2, 9, '2026-04-20', 'pending', 1),
('API Integration', 'Connect frontend to backend', 2, 9, '2026-04-22', 'pending', 0);

-- Insert attendance
INSERT INTO attendance (intern_id, date, status) VALUES
(2, '2026-04-01', 'present'),
(2, '2026-04-02', 'present'),
(2, '2026-04-03', 'absent'),
(2, '2026-04-04', 'present'),
(2, '2026-04-05', 'present');

-- Insert feedback
INSERT INTO feedback (mentor_id, intern_id, message, rating) VALUES
(9, 2, 'Great work on the login UI. Very clean design.', 5),
(9, 2, 'Improve responsiveness on mobile devices.', 4);

-- Verify
SELECT COUNT(*) as task_count FROM tasks;
SELECT COUNT(*) as attendance_count FROM attendance;
SELECT COUNT(*) as feedback_count FROM feedback;
ALTER TABLE tasks ADD COLUMN is_today TINYINT(1) DEFAULT 0;

SET SQL_SAFE_UPDATES = 0;
ALTER TABLE tasks ADD COLUMN is_today TINYINT(1) DEFAULT 0;
DELETE FROM tasks;
DELETE FROM attendance;
DELETE FROM feedback;

INSERT INTO tasks (title, description, assigned_to, assigned_by, due_date, status, is_today) VALUES 
('Build Login Page UI', 'Using HTML and CSS', 2, 9, '2026-04-15', 'completed', 0),
('Auth Flow Setup', 'JWT and bcrypt', 2, 9, '2026-04-16', 'completed', 0),
('DB Schema Design', 'MySQL tables', 2, 9, '2026-04-17', 'completed', 0),
('Dashboard UI', 'Build the dashboard', 2, 9, '2026-04-20', 'pending', 1),
('API Integration', 'Connect frontend to backend', 2, 9, '2026-04-22', 'pending', 0);

INSERT INTO attendance (intern_id, date, status) VALUES
(2, '2026-04-01', 'present'),
(2, '2026-04-02', 'present'),
(2, '2026-04-03', 'absent'),
(2, '2026-04-04', 'present'),
(2, '2026-04-05', 'present');

INSERT INTO feedback (mentor_id, intern_id, message, rating) VALUES
(9, 2, 'Great work on the login UI. Very clean design.', 5),
(9, 2, 'Improve responsiveness on mobile devices.', 4);

SELECT COUNT(*) as task_count FROM tasks;
SELECT COUNT(*) as attendance_count FROM attendance;
SELECT COUNT(*) as feedback_count FROM feedback;

SET SQL_SAFE_UPDATES = 0;

DELETE FROM tasks;
DELETE FROM attendance;
DELETE FROM feedback;

INSERT INTO tasks (title, description, assigned_to, assigned_by, due_date, status, is_today) VALUES 
('Build Login Page UI', 'Using HTML and CSS', 2, 9, '2026-04-15', 'completed', 0),
('Auth Flow Setup', 'JWT and bcrypt', 2, 9, '2026-04-16', 'completed', 0),
('DB Schema Design', 'MySQL tables', 2, 9, '2026-04-17', 'completed', 0),
('Dashboard UI', 'Build the dashboard', 2, 9, '2026-04-20', 'pending', 1),
('API Integration', 'Connect frontend to backend', 2, 9, '2026-04-22', 'pending', 0);

INSERT INTO attendance (intern_id, date, status) VALUES
(2, '2026-04-01', 'present'),
(2, '2026-04-02', 'present'),
(2, '2026-04-03', 'absent'),
(2, '2026-04-04', 'present'),
(2, '2026-04-05', 'present');

INSERT INTO feedback (mentor_id, intern_id, message, rating) VALUES
(9, 2, 'Great work on the login UI. Very clean design.', 5),
(9, 2, 'Improve responsiveness on mobile devices.', 4);

SELECT COUNT(*) as task_count FROM tasks;
SELECT COUNT(*) as attendance_count FROM attendance;
SELECT COUNT(*) as feedback_count FROM feedback;
ALTER TABLE tasks MODIFY COLUMN status VARCHAR(50) DEFAULT 'pending';
INSERT INTO tasks (title, description, assigned_to, assigned_by, due_date, status, is_today) VALUES 
('Build Login Page UI', 'Using HTML and CSS', 2, 9, '2026-04-15', 'completed', 0),
('Auth Flow Setup', 'JWT and bcrypt', 2, 9, '2026-04-16', 'completed', 0),
('DB Schema Design', 'MySQL tables', 2, 9, '2026-04-17', 'completed', 0),
('Dashboard UI', 'Build the dashboard', 2, 9, '2026-04-20', 'pending', 1),
('API Integration', 'Connect frontend to backend', 2, 9, '2026-04-22', 'pending', 0);

INSERT INTO attendance (intern_id, date, status) VALUES
(2, '2026-04-01', 'present'),
(2, '2026-04-02', 'present'),
(2, '2026-04-03', 'absent'),
(2, '2026-04-04', 'present'),
(2, '2026-04-05', 'present');

INSERT INTO feedback (mentor_id, intern_id, message, rating) VALUES
(9, 2, 'Great work on the login UI. Very clean design.', 5),
(9, 2, 'Improve responsiveness on mobile devices.', 4);

SELECT COUNT(*) as task_count FROM tasks;
SELECT COUNT(*) as attendance_count FROM attendance;
SELECT COUNT(*) as feedback_count FROM feedback;

-- Check Monisha's details
SELECT id, name, email FROM users WHERE id = 2;
UPDATE users SET password = '$2b$10$NyvSEVcgkMHzIi58/8d2/e6VaXHM3f1HhCkrL4r6OZ6Cla3o3ahzC' WHERE id = 2;
CREATE TABLE IF NOT EXISTS internship_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value VARCHAR(255) NOT NULL
);

INSERT INTO internship_settings (setting_key, setting_value) 
VALUES ('submission_deadline', '2026-07-05T23:59:00');

UPDATE internship_settings
SET setting_value = '2026-07-03T23:59:00'
WHERE setting_key = 'submission_deadline';

UPDATE tasks
SET status = 'pending'
WHERE is_today = 1;

USE internsync;

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);
SHOW TABLES;
DESCRIBE messages;

USE internsync;
SELECT * FROM messages;
USE internsync;
SELECT id, name, role FROM users;

USE internsync;
DELETE FROM messages;
ALTER TABLE messages AUTO_INCREMENT = 1;

INSERT INTO messages (sender_id, receiver_id, message, sent_at) VALUES
(1, 2, 'Good morning Monisha! How is the dashboard UI coming along?', '2026-04-12 09:30:00'),
(2, 1, 'Good morning! Almost done with the card layout. Should have it ready by noon.', '2026-04-12 09:32:00'),
(1, 2, 'Excellent! Make sure the attendance ring animation is smooth across browsers. Safari can be tricky with SVG transitions.', '2026-04-12 09:34:00'),
(2, 1, 'Yes, tested on Chrome and Firefox already. Will check Safari right now!', '2026-04-12 09:35:00'),
(1, 2, 'Also I reviewed your login page submission. Really clean work. The micro-interactions are exactly what we were looking for!', '2026-04-12 09:40:00'),
(2, 1, 'Thank you so much! That means a lot. I spent extra time getting the button effect just right.', '2026-04-12 09:41:00'),
(1, 2, 'For the next task — API integration — ping me before you start. I want to walk you through the auth headers first.', '2026-04-12 09:45:00'),
(2, 1, 'Absolutely! Will ping you once done with the dashboard. Estimated 2 hours.', '2026-04-12 09:46:00'),
(1, 2, 'Sounds good. I will be available all afternoon. Keep up the great work!', '2026-04-12 09:47:00');

SELECT * FROM messages;

SELECT * FROM messages ORDER BY sent_at DESC LIMIT 1;


SELECT * FROM messages;
SELECT * FROM users;
SELECT COUNT(*) as task_count FROM tasks;


-- 1. Confirm Dashboard UI is pending (should show 'pending')
SELECT id, title, status, is_today FROM tasks WHERE assigned_to = 2;

-- 2. Confirm the status column type (should be VARCHAR not ENUM)
DESCRIBE tasks;

-- 3. Reset Dashboard UI to pending if it got stuck
UPDATE tasks SET status = 'pending' WHERE is_today = 1 AND assigned_to = 2;

-- 4. Verify
SELECT id, title, status, is_today FROM tasks WHERE is_today = 1;

USE internsync;

-- Then check tasks
SELECT id, title, status, is_today FROM tasks WHERE assigned_to = 2;

USE internsync;

-- Reset Dashboard UI back to pending
UPDATE tasks SET status = 'pending' WHERE id = 5;

-- Verify
SELECT id, title, status, is_today FROM tasks WHERE assigned_to = 2;


USE internsync;

-- Confirm mentor code exists
SELECT * FROM mentor_codes;

-- Confirm Raj Sharma is in users with role=mentor
SELECT id, name, email, role FROM users WHERE email = 'rajsharma@gmail.com';

-- If mentor_codes is empty, re-insert
INSERT IGNORE INTO mentor_codes (email, code) VALUES ('rajsharma@gmail.com', 'men_770');



USE internsync;
SELECT id, name, email, role, LEFT(password,15) as pw_preview 
FROM users 
WHERE email = 'rajsharma@gmail.com';

SELECT * FROM users
USE internsync;
DROP TABLE IF EXISTS submissions;


-- Run this against your existing `internsync` database
-- mysql -u root -p internsync < add_tasks_tables.sql

USE internsync;

CREATE TABLE IF NOT EXISTS interns (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  email      VARCHAR(150),
  color      VARCHAR(30)  DEFAULT '#d9a441',
  bg         VARCHAR(50)  DEFAULT 'rgba(217,164,65',
  photo      VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO interns (name, color, bg) VALUES
  ('Monisha K',      '#d9a441', 'rgba(217,164,65'),
  ('Fiona Shalet',   '#2dd4bf', 'rgba(45,212,191'),
  ('Stella Mary',    '#ff6b6b', 'rgba(255,107,107'),
  ('Bhavana R',      '#4ade80', 'rgba(74,222,128'),
  ('Deekshitha S',   '#c084fc', 'rgba(168,85,247'),
  ('Arun Prasad',    '#fbbf24', 'rgba(251,191,36'),
  ('Shonn Dias',     '#38bdf8', 'rgba(56,189,248'),
  ('Bhoomika Ravi',  '#fb7185', 'rgba(251,113,133'),
  ('Hrithika Gowda', '#818cf8', 'rgba(99,102,241'),
  ('Vinay Kumar',    '#2dd4bf', 'rgba(20,184,166');
  CREATE TABLE IF NOT EXISTS tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  intern_id   INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  priority    ENUM('low','medium','high') DEFAULT 'medium',
  category    ENUM('html','js','backend','db','react','uiux') DEFAULT 'js',
  status      ENUM('pending','in-progress','completed') DEFAULT 'pending',
  deadline    DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (intern_id) REFERENCES interns(id) ON DELETE CASCADE,
  INDEX idx_intern  (intern_id),
  INDEX idx_status  (status),
  INDEX idx_priority(priority)
);
SHOW TABLES;
SELECT * FROM interns;
USE internsync;
SELECT * FROM tasks;

ALTER TABLE certificates
ADD COLUMN intern_name VARCHAR(255),
ADD COLUMN domain VARCHAR(255),
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE,
ADD COLUMN note TEXT;
SELECT * FROM certificates;
-- ============================================================
--  InternSync — Certificates table migration
--  Run this once in your MySQL client:
--    mysql -u root -p internsync < create_certificates_table.sql
-- ============================================================

-- Run this in your MySQL database to add missing fields
-- Run these ONE TIME to add missing columns
-- This version safely skips columns that already exist
-- 1. See which duplicates exist
SELECT internId, issueDate, COUNT(*) as duplicate_count 
FROM certificates 
GROUP BY internId, issueDate 
HAVING duplicate_count > 1;

SET SQL_SAFE_UPDATES = 0;

DELETE c1 FROM certificates c1
INNER JOIN certificates c2 
  ON c1.internId = c2.internId 
  AND c1.issueDate = c2.issueDate
  AND c1.id < c2.id;

SET SQL_SAFE_UPDATES = 1;

-- Now safely add the unique constraint
ALTER TABLE certificates ADD UNIQUE KEY unique_intern_issue (internId, issueDate);

-- Confirm columns exist
DESCRIBE certificates;

-- Check that duplicates are gone
SELECT internId, issueDate, COUNT(*) as cnt FROM certificates GROUP BY internId, issueDate HAVING cnt > 1;
-- Should return: Empty set (0.00 sec)

USE internsync; -- to check qr code--
SELECT id, qr_code_path FROM certificates ORDER BY id DESC LIMIT 1;

USE internsync;
select * from users;

USE internsync;
-- ============================================================
-- InternSync — Run this once in MySQL to set up tasks properly
-- ============================================================

-- 1. Make sure the tasks table exists with the right schema
CREATE TABLE IF NOT EXISTS tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  intern_id   INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  priority    ENUM('low','medium','high') DEFAULT 'medium',
  category    VARCHAR(50) DEFAULT 'js',
  status      ENUM('pending','in-progress','completed') DEFAULT 'pending',
  deadline    DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (intern_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Insert your 10 interns into users table if they don't exist yet
--    (INSERT IGNORE skips rows where email already exists)
INSERT IGNORE INTO users (name, email, role, password) VALUES
('Monisha K',      'monishak@intern.local',     'intern', 'placeholder'),
('Fiona Shalet',   'fionashalet@intern.local',   'intern', 'placeholder'),
('Stella Mary',    'stellamary@intern.local',    'intern', 'placeholder'),
('Bhavana R',      'bhavanr@intern.local',       'intern', 'placeholder'),
('Deekshitha S',   'deekshithas@intern.local',   'intern', 'placeholder'),
('Arun Prasad',    'arunprasad@intern.local',    'intern', 'placeholder'),
('Shonn Dias',     'shonndias@intern.local',     'intern', 'placeholder'),
('Bhoomika Ravi',  'bhoomikaravi@intern.local',  'intern', 'placeholder'),
('Hrithika Gowda', 'hrithikagowda@intern.local', 'intern', 'placeholder'),
('Vinay Kumar',    'vinaykumar@intern.local',    'intern', 'placeholder');

-- 3. Verify interns were inserted
SELECT id, name, role FROM users WHERE role = 'intern' ORDER BY name;

-- 1. Drop the old broken foreign key
ALTER TABLE tasks DROP FOREIGN KEY tasks_ibfk_1;

-- 2. Re-add it pointing to users table instead of interns
ALTER TABLE tasks
  ADD CONSTRAINT tasks_ibfk_1
  FOREIGN KEY (intern_id) REFERENCES users(id) ON DELETE CASCADE;

-- 3. Confirm your interns exist in users table
SELECT id, name, role FROM users WHERE role = 'intern';

CREATE OR REPLACE VIEW tasks_view AS
SELECT 
  t.id,
  u.name AS intern_name,
  t.title,
  t.description,
  t.priority,
  t.category,
  t.status,
  t.deadline,
  t.created_at
FROM tasks t
JOIN users u ON t.intern_id = u.id
ORDER BY t.created_at DESC;

-- Then just run this anytime:
SELECT * FROM tasks_view;
select*from tasks;
USE internsync;
select*from messages;


-- InternSync — Discussion Room
CREATE TABLE IF NOT EXISTS discussion_messages (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  sender_name  VARCHAR(100) NOT NULL,
  sender_photo VARCHAR(255) DEFAULT '',
  message      TEXT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created (created_at)
);

-- Verify
SELECT * FROM discussion_messages ORDER BY created_at DESC LIMIT 10;
select *from discussion_messages;

CREATE TABLE mentor_profile (
  id           VARCHAR(20)  PRIMARY KEY,
  name         VARCHAR(100),
  role         VARCHAR(150),
  company      VARCHAR(100),
  email        VARCHAR(100),
  phone        VARCHAR(20),
  location     VARCHAR(200),
  experience   VARCHAR(100),
  expertise    TEXT,          -- stored as JSON string
  photo_url    TEXT,          -- base64 or file path
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert the default mentor row
INSERT INTO mentor_profile (id, name, role, company, email, phone, location, experience, expertise, photo_url)
VALUES (
  'MEN-770',
  'Raj Sharma',
  'Senior Full Stack Developer',
  'IBM India',
  'rajsharma@ibm.com',
  '+91 98765 43210',
  'Manyata Embassy Business Park, Bengaluru',
  '8 Years at IBM',
  '["Full Stack Development","React & Node.js","Cloud (AWS)","Microservices","System Design","DevOps","Agile / Scrum","Code Review","Team Mentoring"]',
  ''
);
select *from mentor_profile;

CREATE TABLE attendance (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  intern_id   INT NOT NULL,
  date        DATE NOT NULL,
  status      ENUM('green','yellow','red') DEFAULT 'red',
  timeline    VARCHAR(20) DEFAULT '00000000',
  acts        VARCHAR(100) DEFAULT '',
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_intern_date (intern_id, date)
);

CREATE TABLE attendance_events (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  intern_id   INT NOT NULL,
  date        DATE NOT NULL,
  event_time  VARCHAR(10),
  label       VARCHAR(200),
  color       VARCHAR(10) DEFAULT 'green',
  INDEX idx_intern_date (intern_id, date)
);

-- Drop and recreate correctly (safe if no real data yet)
DROP TABLE IF EXISTS attendance;

CREATE TABLE attendance (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  intern_id  INT NOT NULL,
  date       DATE NOT NULL,
  status     VARCHAR(10) NOT NULL DEFAULT 'red',
  timeline   VARCHAR(8)  NOT NULL DEFAULT '00000000',
  acts       VARCHAR(100) DEFAULT '',
  UNIQUE KEY uq_intern_date (intern_id, date)
);

SELECT * FROM attendance;
SELECT * FROM attendance_events;

-- InternSync: Feedback Table Migration
-- ============================================================
-- ============================================================
-- STEP 1: Run this first to see your actual intern IDs
-- ============================================================
SELECT id, name, email, role FROM users WHERE role = 'intern' ORDER BY id;

-- ============================================================
-- STEP 2: Run this to see your actual mentor ID
-- ============================================================
SELECT id, name, email, role FROM users WHERE role = 'mentor' ORDER BY id;

-- ============================================================
-- STEP 3: After running the above, find the IDs for:
--   Monisha K, Fiona Shalet, Stella Mary, Bhavana R
-- Then replace the ???? placeholders below with real IDs
-- and replace mentor_id 9 with your actual mentor ID if different
-- ============================================================

INSERT INTO feedback
  (mentor_id, intern_id, message, rating, tags, improvements,
   efficiency, punctuality, code_quality, communication, created_at)
VALUES
(9, ????,  -- replace with Monisha K's id
 'Your recent frontend optimizations significantly improved the site speed. Great attention to detail — this is exactly the standard we expect going forward.',
 5, '["Great Work","On Track","Strong Code"]',
 '["Master advanced React state patterns","Write more unit tests"]',
 92, 98, 88, 85, '2026-03-18 10:00:00'),

(9, ????,  -- replace with Fiona Shalet's id
 'The component library submission was outstanding. Clean abstractions, excellent TypeScript usage and the Storybook docs are a huge plus.',
 5, '["Excellent UI","Creative","On Track"]',
 '["Improve accessibility practices","Document edge cases"]',
 88, 95, 91, 80, '2026-03-16 10:00:00'),

(9, ????,  -- replace with Stella Mary's id
 'The API documentation was incomplete and the JWT implementation had security gaps. You need to focus on edge case handling and security best practices.',
 3, '["Needs Improvement","Falling Behind"]',
 '["Review JWT security patterns","Complete all documentation","Ask for help earlier"]',
 55, 70, 50, 60, '2026-03-14 10:00:00'),

(9, ????,  -- replace with Bhavana R's id
 'Excellent ER diagram and normalization in the MySQL submission. Your ability to write clean schemas with well-placed indexes is impressive.',
 5, '["Top Performer","Strong SQL","On Track"]',
 '["Explore advanced query optimization"]',
 90, 96, 88, 88, '2026-03-12 10:00:00');
 
 SELECT id, name FROM users 
WHERE name IN ('Monisha K', 'Fiona Shalet', 'Stella Mary', 'Bhavana R')
ORDER BY name;

-- ============================================================
-- First update existing rows to use mentor_id = 1
-- ============================================================
UPDATE feedback SET mentor_id = 1 WHERE mentor_id = 9;

-- ============================================================
-- Seed feedback for remaining 6 interns (Deekshitha through Vinay)
-- Only run if these don't already exist
-- ============================================================
INSERT INTO feedback
  (mentor_id, intern_id, message, rating, tags, improvements,
   efficiency, punctuality, code_quality, communication, created_at)
VALUES

(1, 23,
 'Your UI mockups showed great visual thinking. The color palette choices were intentional and your Figma component structure is well-organized. Keep pushing on interaction design.',
 4, '["Creative","Excellent UI","On Track"]',
 '["Study micro-interactions and animation","Improve mobile responsiveness in designs"]',
 78, 85, 72, 80, '2026-03-17 10:00:00'),

(1, 24,
 'Solid backend fundamentals shown in the REST API submission. Error handling was thorough and the middleware chain was clean. Looking forward to seeing your database optimization work.',
 4, '["Strong Code","On Track","Communication"]',
 '["Learn query optimization techniques","Add API rate limiting"]',
 82, 90, 85, 78, '2026-03-15 10:00:00'),

(1, 25,
 'I am concerned about your progress this week. Two deadlines were missed and the submitted code had significant bugs. We need to have a check-in to understand what support you need.',
 2, '["Needs Improvement","Falling Behind"]',
 '["Reach out for help before deadlines","Test code before submitting","Improve time management"]',
 40, 45, 38, 50, '2026-03-13 10:00:00'),

(1, 26,
 'Outstanding performance this sprint. Your React component library is production-ready and your attention to accessibility standards sets you apart. You are clearly the benchmark for the cohort.',
 5, '["Top Performer","Great Work","On Track"]',
 '["Mentor junior peers on component design"]',
 95, 98, 93, 90, '2026-03-11 10:00:00'),

(1, 27,
 'Your Node.js API shows understanding of the concepts but the implementation has some gaps in authentication middleware. Please review JWT best practices and resubmit the security module.',
 3, '["Needs Improvement","Strong Code"]',
 '["Review JWT middleware patterns","Add input sanitization","Write integration tests"]',
 60, 72, 58, 65, '2026-03-10 10:00:00'),

(1, 28,
 'Great improvement from last week. The database schema design was well-normalized and your documentation has improved significantly. Keep this momentum going into the next sprint.',
 4, '["Great Work","On Track","Strong SQL"]',
 '["Explore indexing strategies for large tables"]',
 80, 88, 82, 84, '2026-03-09 10:00:00');

-- ============================================================
-- Verify all 10 interns have feedback
-- ============================================================
SELECT f.id, u.name AS intern, f.rating, f.tags, f.created_at
FROM feedback f
JOIN users u ON u.id = f.intern_id
WHERE f.mentor_id = 1
ORDER BY f.created_at DESC;

-- Run this in your MySQL DB (internsync)
-- Creates the leave_requests table with the correct columns
USE internsync;
CREATE TABLE IF NOT EXISTS leave_requests (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  intern_id   INT          NOT NULL,
  leave_type  VARCHAR(50)  NOT NULL DEFAULT 'Other',
  reason      TEXT         NOT NULL,
  leave_date  DATE         NOT NULL,
  status      ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (intern_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Optional: seed the two hardcoded rows you had in the HTML
-- Replace intern_id with the actual user id of Monisha K from your users table
-- e.g. if her id is 7:
-- INSERT INTO leave_requests (intern_id, leave_type, reason, leave_date, status, created_at)
-- VALUES
--   (7, 'Family',  'Family Event',   '2026-03-05', 'approved', NOW()),
--   (7, 'Medical', 'Medical Checkup','2026-03-12', 'pending',  NOW());
DESCRIBE leave_requests;
ALTER TABLE leave_requests
  ADD COLUMN leave_type  VARCHAR(50)  NOT NULL DEFAULT 'Other'  AFTER intern_id,
  ADD COLUMN leave_date  DATE         NULL                       AFTER reason;
  DESCRIBE leave_requests;
  
  SELECT id FROM users WHERE name LIKE '%Monisha%';
  INSERT INTO leave_requests (intern_id, leave_type, reason, leave_date, status)
VALUES
  (2, 'Family',  'Family Event',    '2026-03-05', 'approved'),
  (2, 'Medical', 'Medical Checkup', '2026-03-12', 'pending');
  UPDATE leave_requests SET intern_id = 9 WHERE intern_id = 2;
  
Select *from leave_requests;
UPDATE leave_requests SET intern_id = 9 WHERE intern_id = 2;
SELECT id, name, role FROM users WHERE name LIKE '%Monisha%' OR name LIKE '%Shonn%' OR name LIKE '%Deekshitha%';
SELECT id, intern_id, leave_type, reason FROM leave_requests;

-- Fix existing 3 rows to be Monisha K (id=19)
UPDATE leave_requests SET intern_id = 19 WHERE id IN (1, 2, 3);

-- Add Shonn Dias leave
INSERT INTO leave_requests (intern_id, leave_type, reason, leave_date, status)
VALUES (25, 'Sick', 'High fever and throat infection since yesterday. Will resume once recovered.', '2026-04-20', 'pending');

-- Add Deekshitha S leave
INSERT INTO leave_requests (intern_id, leave_type, reason, leave_date, status)
VALUES (23, 'Personal', 'Grandmother passed away. Need to travel to hometown for the funeral.', '2026-04-21', 'pending');

SELECT * FROM leave_requests;
SELECT lr.id, lr.intern_id, u.name AS intern_name, lr.leave_type, lr.status
FROM leave_requests lr
JOIN users u ON lr.intern_id = u.id;
SELECT * FROM leave_requests;

-- Fix Deekshitha's missing row
INSERT INTO leave_requests (intern_id, leave_type, reason, leave_date, from_date, to_date, status)
VALUES (23, 'Personal', 'Grandmother passed away. Need to travel to hometown for the funeral.', '2026-04-21', '2026-04-21', '2026-04-23', 'pending');

-- Add from/to dates to existing rows
UPDATE leave_requests SET from_date = leave_date, to_date = leave_date WHERE from_date IS NULL;

SELECT * FROM leave_requests;

USE internsync;

-- Ensure from_date and to_date columns exist
ALTER TABLE leave_requests 
  ADD COLUMN IF NOT EXISTS from_date DATE NULL,
  ADD COLUMN IF NOT EXISTS to_date   DATE NULL;

-- Backfill any rows where from/to are NULL
UPDATE leave_requests 
SET from_date = leave_date, to_date = leave_date 
WHERE from_date IS NULL OR to_date IS NULL;

-- Verify your intern IDs
SELECT id, name, role FROM users 
WHERE name IN ('Monisha K','Shonn Dias','Deekshitha S','Fiona Shalet','Stella Mary','Bhoomika Ravi');

-- Verify final state
SELECT lr.id, u.name AS intern_name, lr.leave_type, 
       lr.from_date, lr.to_date, lr.status 
FROM leave_requests lr
JOIN users u ON lr.intern_id = u.id
ORDER BY lr.created_at DESC;

-- Add from_date only if it doesn't exist
ALTER TABLE leave_requests ADD COLUMN from_date DATE NULL;
-- If you get "Duplicate column name" error on the above, skip it — column already exists

-- Add to_date only if it doesn't exist  
ALTER TABLE leave_requests ADD COLUMN to_date DATE NULL;
-- Same — skip if duplicate column error

-- Backfill nulls
UPDATE leave_requests 
SET from_date = leave_date, to_date = leave_date 
WHERE from_date IS NULL OR to_date IS NULL;

-- Verify
SELECT lr.id, u.name AS intern_name, lr.leave_type, 
       lr.from_date, lr.to_date, lr.status 
FROM leave_requests lr
JOIN users u ON lr.intern_id = u.id
ORDER BY lr.created_at DESC;

SET SQL_SAFE_UPDATES = 0;

UPDATE leave_requests 
SET from_date = leave_date, to_date = leave_date 
WHERE from_date IS NULL OR to_date IS NULL;

SET SQL_SAFE_UPDATES = 1;
SELECT lr.id, u.name AS intern_name, lr.leave_type, 

SET SQL_SAFE_UPDATES = 0;

-- Delete duplicate Deekshitha rows (keep only the latest one, id=7)
DELETE FROM leave_requests WHERE id IN (5, 6);

-- Delete Raj Sharma's row (wrong intern, shouldn't be there)
DELETE FROM leave_requests WHERE id = 8;

SET SQL_SAFE_UPDATES = 1;

-- Verify final clean state
SELECT lr.id, u.name AS intern_name, lr.leave_type, 
       lr.from_date, lr.to_date, lr.status 
FROM leave_requests lr
JOIN users u ON lr.intern_id = u.id
ORDER BY lr.created_at DESC;

select*from leave_requests;

-- Create a clean view that shows intern_name instead of intern_id
CREATE OR REPLACE VIEW leave_requests_view AS
SELECT 
  lr.id,
  u.name        AS intern_name,
  lr.leave_type,
  lr.reason,
  lr.leave_date,
  lr.from_date,
  lr.to_date,
  lr.status,
  lr.created_at
FROM leave_requests lr
JOIN users u ON lr.intern_id = u.id;

-- Now query the view instead
SELECT * FROM leave_requests_view ORDER BY created_at DESC;
SELECT * FROM leave_requests_view;

USE internsync;

-- ─────────────────────────────────────────────────────────
--  submissions table — run this once in your MySQL database
-- ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS submissions (
  id           INT          NOT NULL AUTO_INCREMENT,
  intern_id    VARCHAR(50)  NOT NULL,               -- matches users.id (could be INT or VARCHAR)
  task_name    VARCHAR(255) NOT NULL,
  github_url   VARCHAR(500) DEFAULT NULL,
  file_path    VARCHAR(500) DEFAULT NULL,
  status       ENUM('pending','reviewed','approved','late') NOT NULL DEFAULT 'pending',
  feedback     TEXT         DEFAULT NULL,
  submitted_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_intern_id (intern_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────
--  If intern_id in your users table is INT, add a FK:
-- ─────────────────────────────────────────────────────────
-- ALTER TABLE submissions
--   ADD CONSTRAINT fk_submissions_intern
--   FOREIGN KEY (intern_id) REFERENCES users(id)
--   ON DELETE CASCADE;

-- ─────────────────────────────────────────────────────────
--  Verify the table was created
-- ─────────────────────────────────────────────────────────
DESCRIBE submissions;
 USE internsync;
CREATE TABLE myinterns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100),
  track VARCHAR(50),
  email VARCHAR(150),
  phone VARCHAR(20),
  location VARCHAR(150),
  college VARCHAR(200),
  cgpa VARCHAR(10),
  linkedin VARCHAR(200),
  github VARCHAR(200),
  skills TEXT,
  pct INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  tasks_total INT DEFAULT 0,
  tasks_done INT DEFAULT 0,
  color VARCHAR(20),
  summary TEXT,
  mentor VARCHAR(100),
  program VARCHAR(100),
  duration VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO myinterns (name, role, track, email, phone, location, college, cgpa, linkedin, github, skills, pct, status, tasks_total, tasks_done, color, summary, mentor, program, duration) VALUES

('Monisha K', 'Full Stack Intern', 'fullstack', 'monisha.k@ibm-intern.in', '+91 98401 12345', 'Chennai, Tamil Nadu', 'Sri Sivasubramaniya Nadar College of Engineering', '8.7', 'linkedin.com/in/monishak', 'github.com/monishak', 'HTML,CSS,JavaScript,React,Node.js,MySQL', 62, 'active', 5, 3, '#d9a441', 'Passionate Full Stack Developer with hands-on experience in React and Node.js. Focusing on database optimisation and scalable web architectures for InternSync under IBM SkillsBuild.', 'Raj Shamani', 'IBM SkillsBuild', 'Jan 15 – Apr 15, 2026'),

('Fiona Shalet', 'Frontend Intern', 'frontend', 'fiona.shalet@ibm-intern.in', '+91 94455 67890', 'Kochi, Kerala', 'College of Engineering Trivandrum', '9.1', 'linkedin.com/in/fionashalet', 'github.com/fionashalet', 'HTML,CSS,Tailwind,React,Figma,TypeScript', 78, 'active', 6, 5, '#2dd4bf', 'Creative Frontend Developer with strong proficiency in React and TypeScript. Passionate about pixel-perfect UI design and accessibility. Building reusable component libraries for InternSync.', 'Raj Shamani', 'IBM SkillsBuild', 'Jan 15 – Apr 15, 2026'),

('Stella Mary', 'Backend Intern', 'backend', 'stella.mary@ibm-intern.in', '+91 90001 23456', 'Coimbatore, Tamil Nadu', 'PSG College of Technology', '7.8', 'linkedin.com/in/stellamary', 'github.com/stellamary', 'Node.js,Express,PHP,MySQL,REST APIs,JWT', 45, 'behind', 4, 2, '#ff6b6b', 'Backend Developer Intern with focus on PHP, Node.js and REST API development. Currently building microservice modules for InternSync. Needs support to get back on track.', 'Raj Shamani', 'IBM SkillsBuild', 'Jan 15 – Apr 15, 2026'),

('Bhavana R', 'Full Stack Intern', 'fullstack', 'bhavana.r@ibm-intern.in', '+91 87654 32100', 'Bengaluru, Karnataka', 'RV College of Engineering', '9.3', 'linkedin.com/in/bhavanar', 'github.com/bhavanar', 'HTML,CSS,JavaScript,React,MongoDB,Python', 85, 'active', 6, 5, '#4ade80', 'Top-performing Full Stack Intern consistently delivering ahead of schedule. Designed the MySQL Schema for InternSync task management module. Mentoring peers on MongoDB patterns.', 'Raj Shamani', 'IBM SkillsBuild', 'Jan 15 – Apr 15, 2026'),

('Deekshitha S', 'UI/UX Intern', 'frontend', 'deekshitha.s@ibm-intern.in', '+91 99887 65432', 'Mysuru, Karnataka', 'JSS Science and Technology University', '8.2', 'linkedin.com/in/deekshithas', 'github.com/deekshithas', 'Figma,Adobe XD,HTML,CSS,Prototyping', 55, 'active', 5, 3, '#c084fc', 'UI/UX Design Intern with a keen eye for user-centred design. Proficient in Figma and Adobe XD, with experience prototyping and conducting usability tests for InternSync flows.', 'Raj Shamani', 'IBM SkillsBuild', 'Jan 15 – Apr 15, 2026'),

('Arun Prasad', 'Backend Intern', 'backend', 'arun.prasad@ibm-intern.in', '+91 91234 56789', 'Madurai, Tamil Nadu', 'Thiagarajar College of Engineering', '8.5', 'linkedin.com/in/arunprasad', 'github.com/arunprasad', 'PHP,MySQL,Python,Django,REST APIs,Redis', 70, 'active', 5, 4, '#fbbf24', 'Experienced Backend Developer Intern with strong skills in Python, Django and Redis. Delivered the Django API module for InternSync task assignment system. Smart India Hackathon finalist.', 'Raj Shamani', 'IBM SkillsBuild', 'Jan 15 – Apr 15, 2026'),

('Shonn Dias', 'Full Stack Intern', 'fullstack', 'shonn.dias@ibm-intern.in', '+91 77788 99001', 'Goa', 'Goa College of Engineering', '7.2', 'linkedin.com/in/shonndias', 'github.com/shonndias', 'JavaScript,Vue.js,Node.js,PostgreSQL,Docker', 38, 'risk', 4, 2, '#38bdf8', 'Full Stack Intern with experience in Vue.js and Docker. Keen on DevOps and containerisation. Currently behind on PostgreSQL integration tasks — intervention recommended.', 'Raj Shamani', 'IBM SkillsBuild', 'Jan 15 – Apr 15, 2026'),

('Bhoomika Ravi', 'Frontend Intern', 'frontend', 'bhoomika.ravi@ibm-intern.in', '+91 96543 21098', 'Bengaluru, Karnataka', 'M S Ramaiah Institute of Technology', '9.4', 'linkedin.com/in/bhoomika-ravi', 'github.com/bhoomika-ravi', 'React,TypeScript,CSS,Sass,Jest,Webpack', 91, 'active', 6, 6, '#fb7185', 'Top-ranked Frontend Intern with exceptional React and TypeScript skills. Completed all 6 assigned tasks and additionally conducted peer reviews. Lighthouse score of 98 on her deliverables.', 'Raj Shamani', 'IBM SkillsBuild', 'Jan 15 – Apr 15, 2026'),

('Hrithika Gowda', 'Backend Intern', 'backend', 'hrithika.gowda@ibm-intern.in', '+91 82345 67890', 'Bengaluru, Karnataka', 'BMS College of Engineering', '7.9', 'linkedin.com/in/hrithikagowda', 'github.com/hrithikagowda', 'Java,Spring Boot,MySQL,AWS,REST APIs', 50, 'behind', 4, 2, '#818cf8', 'Backend Developer Intern specialising in Java and Spring Boot. Building REST services and exploring AWS cloud deployment for InternSync. Actively catching up on pending tasks.', 'Raj Shamani', 'IBM SkillsBuild', 'Jan 15 – Apr 15, 2026'),

('Vinay Kumar', 'Full Stack Intern', 'fullstack', 'vinay.kumar@ibm-intern.in', '+91 93456 78901', 'Hyderabad, Telangana', 'JNTUH College of Engineering', '8.0', 'linkedin.com/in/vinaykumar', 'github.com/vinaykumar', 'HTML,CSS,React,Node.js,GraphQL,MongoDB', 74, 'active', 5, 4, '#2dd4bf', 'Full Stack Intern with modern JavaScript expertise, building GraphQL APIs and MongoDB integrations for InternSync. Apollo-certified. Delivered 4/5 tasks ahead of schedule.', 'Raj Shamani', 'IBM SkillsBuild', 'Jan 15 – Apr 15, 2026');

SELECT id, name, role, status, pct FROM myinterns;
select *from myinterns;

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed the hardcoded conversation (mentor=1, monisha=2)
INSERT INTO messages (sender_id, receiver_id, message, sent_at) VALUES
(1, 2, 'Good morning Monisha! How''s the dashboard UI coming along?',                                               '2026-04-23 09:30:00'),
(2, 1, 'Good morning! It''s going great — almost done with the card layout. Should have it ready by noon.',         '2026-04-23 09:32:00'),
(1, 2, 'Excellent! Make sure the attendance ring animation is smooth across browsers. Safari can be tricky with SVG transitions.', '2026-04-23 09:34:00'),
(2, 1, 'Yes, I tested it on Chrome and Firefox already. Will check Safari right now!',                              '2026-04-23 09:35:00'),
(1, 2, 'Also — I reviewed your login page submission. Really clean work. The micro-interactions are exactly what we were looking for.', '2026-04-23 09:40:00'),
(2, 1, 'Thank you so much! That means a lot. I spent extra time getting the magnetic button effect just right.',    '2026-04-23 09:41:00'),
(1, 2, 'It shows. For the next task — API integration — ping me before you start. I want to walk you through the auth headers first.', '2026-04-23 09:45:00'),
(2, 1, 'Absolutely! I''ll ping you once I''m done with the dashboard. Estimated 2 hours.',                         '2026-04-23 09:46:00'),
(1, 2, 'Sounds good. I''ll be available all afternoon. Keep up the great work!',    
                               '2026-04-23 09:47:00');
SELECT id, name, email FROM users ORDER BY id;

SELECT id, name FROM users ORDER BY id;
-- Fiona Shalet (sender=3)
INSERT INTO messages (sender_id, receiver_id, message, sent_at) VALUES
(1, 3, 'Hi Fiona! How is the leave request UI coming along?', '2026-04-23 09:15:00'),
(3, 1, 'Hi Raj! I am working on the status badge — should it animate when it changes state?', '2026-04-23 09:16:00'),
(1, 3, 'Absolutely. A smooth opacity + scale transition would look great. Keep it under 300ms.', '2026-04-23 09:18:00'),
(3, 1, 'Got it! Should I also add a subtle shake animation when a request is rejected?', '2026-04-23 09:20:00'),
(1, 3, 'Love that idea. Add it — but make it gentle. Something like ±4px horizontal, 3 cycles.', '2026-04-23 09:22:00'),
(3, 1, 'Quick question about CSS animations — is transform or margin better for the shake?', '2026-04-23 09:55:00');

-- Vinay Kumar (sender=4)
Use internsync;
INSERT INTO messages (sender_id, receiver_id, message, sent_at) VALUES
(1, 4, 'Vinay, how is the REST API documentation coming along?', '2026-04-23 08:45:00'),
(4, 1, 'Almost done! I have documented all endpoints including auth, users, tasks and submissions.', '2026-04-23 08:48:00'),
(1, 4, 'Great. Make sure to include request/response examples for each endpoint. Postman collection too if possible.', '2026-04-23 08:50:00'),
(4, 1, 'Already done! Added Postman collection and curl examples for all routes.', '2026-04-23 08:53:00'),
(4, 1, 'API docs are ready for review — sent the link to your email!', '2026-04-23 09:10:00');

-- Bhavana R (sender=5)
USE internsync;
INSERT INTO messages (sender_id, receiver_id, message, sent_at) VALUES
(1, 5, 'Bhavana, I reviewed your MySQL schema. Really well thought out — the indexing strategy is particularly good.', '2026-04-23 07:30:00'),
(5, 1, 'Thank you so much! I spent a lot of time on the foreign key relationships to avoid redundancy.', '2026-04-23 07:34:00'),
(1, 5, 'It shows. One suggestion — add a composite index on (user_id, created_at) for the submissions table.', '2026-04-23 07:36:00'),
(5, 1, 'Great point! Will add that right away and update the schema doc.', '2026-04-23 07:38:00'),
(5, 1, 'Thanks for the feedback! Updated and pushed the revised schema.', '2026-04-23 08:00:00');

-- Shonn Dias (sender=6)
INSERT INTO messages (sender_id, receiver_id, message, sent_at) VALUES
(6, 1, 'Hi Raj, I am stuck on the Docker configuration. Getting a ECONNREFUSED on port 5432.', '2026-04-23 06:00:00'),
(1, 6, 'That is a network bridge issue. Make sure your postgres service name in docker-compose matches the DB_HOST env variable.', '2026-04-23 06:10:00'),
(6, 1, 'That was it! Changed DB_HOST to postgres and it connected immediately. Thank you!!', '2026-04-23 06:14:00'),
(1, 6, 'Great debugging! Always check service names match between compose and env files.', '2026-04-23 06:16:00'),
(6, 1, 'Need help with Docker setup — follow up question about volumes persisting after restart?', '2026-04-23 07:00:00');

-- Bhoomika Ravi (sender=7)
INSERT INTO messages (sender_id, receiver_id, message, sent_at) VALUES
(1, 7, 'Bhoomika! Your React component library is looking excellent. The Storybook stories are well structured.', '2026-04-23 05:00:00'),
(7, 1, 'Thank you! I am really enjoying this project. Should I add accessibility aria attributes to all components?', '2026-04-23 05:04:00'),
(1, 7, '100% yes. Accessibility is non-negotiable in production-grade UI. Add aria-label, role and keyboard navigation support.', '2026-04-23 05:06:00'),
(7, 1, 'On it! I will use the WAI-ARIA spec as reference.', '2026-04-23 05:08:00'),
(7, 1, 'Working on the Webpack config to tree-shake unused components from the library build.', '2026-04-23 05:30:00');
 
 Use internsync;

ALTER TABLE tasks ADD COLUMN expectations TEXT;
ALTER TABLE tasks ADD COLUMN notes TEXT;
ALTER TABLE tasks ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE tasks ADD COLUMN due_date DATE;
ALTER TABLE tasks ADD COLUMN created_at DATE;
ALTER TABLE tasks ADD COLUMN is_final TINYINT(1) DEFAULT 0;

INSERT INTO tasks (title, description, deliverables, expectations, notes, status, due_date, created_at, intern_id, is_final)
VALUES (
  'Final Project — InternSync Portal',
  'Design and develop a fully functional intern management portal with an intern-facing dashboard, task tracking, attendance monitoring, submission system, feedback module, and mentor communication features. The portal should be responsive, well-styled, and connected to a Node.js + MySQL backend.',
  '["Complete intern dashboard with stats, progress, and task overview","Task assignment and status tracking system","Attendance ring with present/absent breakdown","Submission portal with file upload support","Mentor feedback module","Leave request and discussion room pages","Authentication (login/register) with JWT"]',
  '["Frontend — HTML, CSS (custom), Vanilla JS","Backend — Node.js, Express.js","Database — MySQL via MySQLWorkbench","Tools — VSCode, Postman, Hostinger / Render for deployment"]',
  '["All pages must share a consistent design language and color theme","JWT token must be validated on every protected API call","Mobile responsiveness is required for all views","Submit a short demo video alongside the codebase"]',
  'pending',
  '2026-05-01',
  '2026-01-01',
  2,
  1
);

INSERT INTO tasks (title, description, deliverables, expectations, notes, status, due_date, created_at, intern_id, is_final)
VALUES (
  'Build Intern Dashboard UI',
  'Create a clean and responsive intern dashboard using modern UI practices.',
  '["Dashboard layout with sidebar","Interactive cards","Responsive design"]',
  '["Clean UI alignment","Consistent color theme","Smooth animations"]',
  '["Languages - HTML, Bootstrap CSS, Vanilla JS, PHP","Software - XAMPP, WebStorm, VSCode","Hosting - Hostinger, Render"]',
  'pending',
  '2026-04-15',
  '2026-04-10',
  2,
  0
);

INSERT INTO tasks (title, description, deliverables, expectations, notes, status, due_date, created_at, intern_id, is_final)
VALUES (
  'Connect Node.js Backend',
  'Integrate frontend with backend APIs using Express and MySQL.',
  '["API integration","Fetch and display data","Error handling"]',
  '["Proper async handling","Secure API usage","Clean code structure"]',
  '["Languages - HTML, Bootstrap CSS, Vanilla JS","Backend and Database - Node.js, Express.js, MySQL","Tools - VScode, MySQLWorkbench, Postman"]',
  'in_progress',
  '2026-04-14',
  '2026-04-08',
  2,
  0
);
ALTER TABLE tasks MODIFY COLUMN status VARCHAR(20) DEFAULT 'pending';

DESCRIBE tasks;
SHOW COLUMNS FROM tasks;
SHOW CREATE TABLE tasks;
INSERT INTO tasks (title, description, deliverables, expectations, notes, status, due_date, created_at, intern_id, is_final)
VALUES (
  'Connect Node.js Backend',
  'Integrate frontend with backend APIs using Express and MySQL.',
  '["API integration","Fetch and display data","Error handling"]',
  '["Proper async handling","Secure API usage","Clean code structure"]',
  '["Languages - HTML, Bootstrap CSS, Vanilla JS","Backend and Database - Node.js, Express.js, MySQL","Tools - VScode, MySQLWorkbench, Postman"]',
  'in_progress',
  '2026-04-14',
  '2026-04-08',
  2,
  0
);
SELECT id, title, status, is_final FROM tasks WHERE intern_id = 2;

select*from tasks;
SELECT id, name, email, role FROM users WHERE role = 'intern';
SELECT id, name, email FROM users WHERE email = 'monishakmurthy7@gmail.com';
UPDATE tasks SET intern_id = 2 WHERE id IN (15, 16, 17);
SELECT id, title, intern_id, is_final FROM tasks LIMIT 20;

INSERT INTO tasks (title, description, deliverables, expectations, notes, status, due_date, created_at, intern_id, is_final)
VALUES (
  'Final Project — InternSync Portal',
  'Design and develop a fully functional intern management portal.',
  '["Complete intern dashboard","Task assignment system","Attendance ring","Submission portal","Mentor feedback module","Leave request pages","Authentication with JWT"]',
  '["Frontend — HTML, CSS, Vanilla JS","Backend — Node.js, Express.js","Database — MySQL","Tools — VSCode, Postman"]',
  '["Consistent design language","JWT on every protected route","Mobile responsiveness required","Submit demo video"]',
  'pending', '2026-05-01', '2026-01-01', 2, 1
);

INSERT INTO tasks (title, description, deliverables, expectations, notes, status, due_date, created_at, intern_id, is_final)
VALUES (
  'Build Intern Dashboard UI',
  'Create a clean and responsive intern dashboard using modern UI practices.',
  '["Dashboard layout with sidebar","Interactive cards","Responsive design"]',
  '["Clean UI alignment","Consistent color theme","Smooth animations"]',
  '["Languages - HTML, Bootstrap CSS, Vanilla JS","Software - XAMPP, VSCode","Hosting - Hostinger"]',
  'pending', '2026-04-15', '2026-04-10', 2, 0
);

INSERT INTO tasks (title, description, deliverables, expectations, notes, status, due_date, created_at, intern_id, is_final)
VALUES (
  'Connect Node.js Backend',
  'Integrate frontend with backend APIs using Express and MySQL.',
  '["API integration","Fetch and display data","Error handling"]',
  '["Proper async handling","Secure API usage","Clean code structure"]',
  '["Languages - HTML, Vanilla JS","Backend - Node.js, Express.js, MySQL","Tools - VSCode, Postman"]',
  'in_progress', '2026-04-14', '2026-04-08', 2, 0
);

SET SQL_SAFE_UPDATES = 0;

DELETE FROM attendance
WHERE date = '2026-04-27'
  AND status = 'red'
  AND timeline = '00000000'
  AND (acts = '' OR acts IS NULL);

SET SQL_SAFE_UPDATES = 1;

DESCRIBE submissions;
-- Allow NULL for optional fields
ALTER TABLE submissions 
  MODIFY github_url VARCHAR(500) NULL,
  MODIFY file_name VARCHAR(255) NULL,
  MODIFY status ENUM('pending', 'on_time', 'late', 'reviewed', 'approved') DEFAULT 'pending';

SELECT id, task_name, file_path, intern_id FROM submissions ORDER BY submitted_at DESC LIMIT 3;

USE internsync;
select*from submissions;
select*from discussion_messages;
ALTER TABLE submissions 
  ADD COLUMN rating INT DEFAULT 0,
  ADD COLUMN review_status ENUM('pending','reviewing','approved','rejected') DEFAULT 'pending';


-- Seed the 10 hardcoded interns into users table
-- (Only inserts if they don't already exist by name)
INSERT INTO users (name, email, role, password)
SELECT * FROM (SELECT 'Monisha K',    'monisha@internsync.com',    'intern', 'seeded') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Monisha K') LIMIT 1;

INSERT INTO users (name, email, role, password)
SELECT * FROM (SELECT 'Fiona Shalet',   'fiona@internsync.com',      'intern', 'seeded') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Fiona Shalet') LIMIT 1;

INSERT INTO users (name, email, role, password)
SELECT * FROM (SELECT 'Stella Mary',  'stella@internsync.com',     'intern', 'seeded') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Stella Mary') LIMIT 1;

INSERT INTO users (name, email, role, password)
SELECT * FROM (SELECT 'Bhavana R',    'bhavana@internsync.com',    'intern', 'seeded') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Bhavana R') LIMIT 1;

INSERT INTO users (name, email, role, password)
SELECT * FROM (SELECT 'Deekshitha S', 'deekshitha@internsync.com', 'intern', 'seeded') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Deekshitha S') LIMIT 1;

INSERT INTO users (name, email, role, password)
SELECT * FROM (SELECT 'Arun Prasad',  'arun@internsync.com',       'intern', 'seeded') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Arun Prasad') LIMIT 1;

INSERT INTO users (name, email, role, password)
SELECT * FROM (SELECT 'Shonn Dias',   'shonn@internsync.com',      'intern', 'seeded') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Shonn Dias') LIMIT 1;

INSERT INTO users (name, email, role, password)
SELECT * FROM (SELECT 'Bhoomika Ravi','bhoomika@internsync.com',   'intern', 'seeded') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Bhoomika Ravi') LIMIT 1;

INSERT INTO users (name, email, role, password)
SELECT * FROM (SELECT 'Hrithika Gowda','hrithika@internsync.com',  'intern', 'seeded') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Hrithika Gowda') LIMIT 1;

INSERT INTO users (name, email, role, password)
SELECT * FROM (SELECT 'Vinay Kumar',  'vinay@internsync.com',      'intern', 'seeded') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Vinay Kumar') LIMIT 1;

-- Seed all 14 hardcoded submissions

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'Database Optimisation', 'Database_Optimisation_Monisha.pdf', '',
  'https://github.com/monisha/db-opt', 'on_time', 'pending', NULL, 0, '2026-03-20 10:00:00'
FROM users WHERE name = 'Monisha K' LIMIT 1;

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'Login Page UI', 'Login_UI_Report_Monisha.docx', '',
  'https://github.com/monisha/login-ui', 'on_time', 'approved',
  'Excellent work! Clean responsive design with great micro-interactions.', 5, '2026-03-15 10:00:00'
FROM users WHERE name = 'Monisha K' LIMIT 1;

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'Auth Flow Setup', 'Auth_Flow_Documentation.pdf', '',
  'https://github.com/monisha/auth-flow', 'on_time', 'approved',
  'Well-structured auth implementation. JWT handling is solid.', 4, '2026-03-10 10:00:00'
FROM users WHERE name = 'Monisha K' LIMIT 1;

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'React Component Library', 'Component_Library_Fiona.pdf', '',
  'https://github.com/fiona/component-lib', 'on_time', 'reviewing', NULL, 0, '2026-03-19 10:00:00'
FROM users WHERE name = 'Fiona Shalet' LIMIT 1;

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'Responsive Dashboard UI', 'Dashboard_Report_Fiona.docx', '',
  'https://github.com/fiona/dashboard', 'on_time', 'approved',
  'Outstanding responsiveness across all breakpoints.', 5, '2026-03-12 10:00:00'
FROM users WHERE name = 'Fiona Shalet' LIMIT 1;

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'REST API Documentation', 'API_Docs_Stella.pdf', '',
  'https://github.com/stella/api-docs', 'on_time', 'pending', NULL, 0, '2026-03-18 10:00:00'
FROM users WHERE name = 'Stella Mary' LIMIT 1;

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'JWT Authentication', 'JWT_Implementation_Stella.docx', '',
  'https://github.com/stella/jwt-auth', 'on_time', 'rejected',
  'Authentication logic has security gaps. Please review token expiry handling.', 2, '2026-03-08 10:00:00'
FROM users WHERE name = 'Stella Mary' LIMIT 1;

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'MySQL Schema Design', 'Schema_Design_Arun.pdf', '',
  'https://github.com/arun/mysql-schema', 'on_time', 'approved',
  'Excellent ER diagram and normalization. Indexes are well-placed.', 5, '2026-03-17 10:00:00'
FROM users WHERE name = 'Arun Prasad' LIMIT 1;

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'Figma Prototype Design', 'Figma_Proto_Bhavana.pdf', '',
  'https://github.com/bhavana/mysql-schema', 'on_time', 'reviewing', NULL, 0, '2026-03-16 10:00:00'
FROM users WHERE name = 'Bhavana R' LIMIT 1;

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'Python Backend Script', 'Python_Backend_Deekshitha.docx', '',
  'https://github.com/deekshitha/python-backend', 'on_time', 'approved',
  'Clean code structure. Django models are well-designed.', 4, '2026-03-14 10:00:00'
FROM users WHERE name = 'Deekshitha S' LIMIT 1;

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'Vue.js Dashboard', 'VueDashboard_Shonn.pdf', '',
  'https://github.com/shonn/vue-dash', 'on_time', 'pending', NULL, 0, '2026-03-13 10:00:00'
FROM users WHERE name = 'Shonn Dias' LIMIT 1;

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'TypeScript Components', 'TS_Components_Bhoomika.pdf', '',
  'https://github.com/bhoomika/ts-components', 'on_time', 'pending', NULL, 0, '2026-03-20 10:00:00'
FROM users WHERE name = 'Bhoomika Ravi' LIMIT 1;

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'Spring Boot API', 'SpringBoot_API_Hrithika.docx', '',
  'https://github.com/hrithika/spring-api', 'on_time', 'rejected',
  'API endpoint structure needs rework. Missing error handling for edge cases.', 2, '2026-03-11 10:00:00'
FROM users WHERE name = 'Hrithika Gowda' LIMIT 1;

INSERT INTO submissions (intern_id, task_name, file_name, file_path, github_url, status, review_status, feedback, rating, submitted_at)
SELECT id, 'GraphQL Integration', 'GraphQL_Vinay.pdf', '',
  'https://github.com/vinay/graphql-app', 'on_time', 'reviewing', NULL, 0, '2026-03-18 10:00:00'
FROM users WHERE name = 'Vinay Kumar' LIMIT 1;

select*from submissions;