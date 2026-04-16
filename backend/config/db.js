// ─── PostgreSQL Database Configuration ───
// Uses the 'pg' module to create a connection pool.
// Demonstrates: Node.js async programming, PostgreSQL integration (Module 5)

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Event-driven: listen for pool connection events (Module 5 - Event emitter concept)
pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// Helper function for running queries (async/await pattern)
const query = async (text, params) => {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('🔍 Query executed', { text: text.substring(0, 60), duration: `${duration}ms`, rows: result.rowCount });
  return result;
};

module.exports = { pool, query };
