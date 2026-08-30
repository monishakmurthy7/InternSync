# InternSync — Internship Management & Evaluation Platform

**InternSync** is a full-stack web application designed to centralize internship workflow management, intern-mentor communication, task distribution, submission tracking, and automated certification.

---

##  Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT, bcrypt, Google OAuth (Passport.js)
- **Utilities & Communications:** Multer (File Uploads), Nodemailer (Email Notifications)

---

##  Key Features -

###  Intern Portal
- **Dashboard & Task Tracking:** View assigned tasks, submission deadlines, and status updates.
- **Report & File Submissions:** Submit project reports and required files seamlessly.
- **Leave Requests & Attendance:** Apply for leave and track attendance logs.
- **Feedback & Private Chat:** Direct communication channel with assigned mentors.
- **Certificate Portal:** Download verified completion certificates with embedded QR codes.

###  Mentor Portal
- **Task & Content Distribution:** Assign custom tasks and release learning materials to interns.
- **Submission Evaluation:** Review submitted work, provide grades, and deliver structured feedback.
- **Attendance & Leave Management:** Approve or decline intern leave applications.
- **Certificate Generation:** Generate verified certificates upon internship completion.

---

##  Project Structure

```plaintext
InternSync/
├── backend/
│   ├── routes/          # API routes (auth, tasks, leave, submissions, etc.)
│   ├── uploads/         # Stored certificate outputs & student submissions
│   ├── db.js            # Database connection setup
│   └── server.js        # Main Express server entry point
└── frontend/
    └── pages/           # HTML templates, client-side JS, and stylesheets
