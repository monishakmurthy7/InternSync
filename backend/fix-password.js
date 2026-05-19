require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

async function fix() {
  const hashed = await bcrypt.hash('monisha', 10);
  db.query(
    'UPDATE users SET password = ? WHERE email = ?',
    [hashed, 'monishakmurthy7@gmail.com'],
    (err, result) => {
      if (err) console.error(err);
      else console.log('✅ Password updated! Rows affected:', result.affectedRows);
      process.exit();
    }
  );
}

fix();