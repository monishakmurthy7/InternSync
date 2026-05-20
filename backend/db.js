// db.js
require('dotenv').config();
const mysql = require('mysql2');

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'MyNewPassword123!',
  database: process.env.DB_NAME || 'internsync',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl: {
    rejectUnauthorized: false   // ← this fixes the SSL handshake error
  }
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err.message);
    return;
  }
  console.log('✅ MySQL Connected Successfully');
  connection.release();
});

const util = require('util');
pool.queryAsync = util.promisify(pool.query).bind(pool);

module.exports = pool;