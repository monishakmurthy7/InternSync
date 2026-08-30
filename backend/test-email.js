require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

transporter.sendMail({
  from: '"InternSync" <monishakmurthy7@gmail.com>',
  to: 'monishakmurthy7@gmail.com',
  subject: 'InternSync Test',
  text: 'If you see this, email works!'
}, (err, info) => {
  if (err) console.error('❌ Error:', err.message);
  else console.log('✅ Email sent:', info.response);
});