// db.js
require('dotenv').config();
const mysql = require('mysql2');

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'MyNewPassword123!',
  database: process.env.DB_NAME || 'internsync',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
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

// Promisify query method for async/await support
const util = require('util');
pool.queryAsync = util.promisify(pool.query).bind(pool);

module.exports = pool;