// ─── Server Entry Point ───
// Demonstrates: Node.js environment setup, Express framework,
// CORS configuration, middleware, modular routing (Modules 5 & 6)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───
// CORS: Allow React frontend to communicate with this API (Module 6 - Integration with React)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// JSON body parser (Module 6)
app.use(express.json());

// Request logger middleware (demonstrates middleware concept)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// ─── Routes (Module 6 - Express Router) ───
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/payroll', require('./routes/payrollRoutes'));
app.use('/api/payslips', require('./routes/payslipRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── Error handling middleware ───
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ─── Start Server (Module 5 - Event-driven, async) ───
const startServer = async () => {
  try {
    // Test database connection
    const client = await pool.connect();
    console.log('✅ PostgreSQL connection verified');
    client.release();

    // Event-driven: server listens for incoming connections (callback pattern)
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
