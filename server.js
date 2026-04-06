// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');

// Create express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Database connection variable
let db;

// Initialize database and create tables
async function initializeDB() {
  // Create data folder if it doesn't exist
  const fs = require('fs');
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  // Open database connection (creates finance.db file)
  db = await open({
    filename: path.join(dataDir, 'finance.db'),
    driver: sqlite3.Database
  });

  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      \`password\` TEXT NOT NULL,
      role TEXT CHECK(role IN ('viewer', 'analyst', 'admin')) DEFAULT 'viewer',
      status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create transactions table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
      category TEXT NOT NULL,
      date DATE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Check if database has any users
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');

  // If no users, add sample data for testing
  if (userCount.count === 0) {
    console.log('Adding sample data...');

    // Create three users with different roles
    const users = [
      { name: 'Viewer User', email: 'viewer@test.com', role: 'viewer', password: 'password123' },
      { name: 'Analyst User', email: 'analyst@test.com', role: 'analyst', password: 'password123' },
      { name: 'Admin User', email: 'admin@test.com', role: 'admin', password: 'password123' }
    ];

    // Insert users with hashed passwords
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await db.run(
        'INSERT INTO users (name, email, `password`, role) VALUES (?, ?, ?, ?)',
        [user.name, user.email, hashedPassword, user.role]
      );
    }

    // Get admin user ID
    const admin = await db.get('SELECT id FROM users WHERE email = ?', 'admin@test.com');

    // Add sample transactions for admin
    const transactions = [
      { amount: 5000, type: 'income', category: 'Salary', date: '2026-03-01', description: 'March salary' },
      { amount: 200, type: 'expense', category: 'Food', date: '2026-03-02', description: 'Groceries' },
      { amount: 1000, type: 'expense', category: 'Rent', date: '2026-03-01', description: 'Monthly rent' },
      { amount: 300, type: 'income', category: 'Freelance', date: '2026-03-05', description: 'Website project' }
    ];

    // Insert transactions
    for (const tx of transactions) {
      await db.run(
        'INSERT INTO transactions (user_id, amount, type, category, date, description) VALUES (?, ?, ?, ?, ?, ?)',
        [admin.id, tx.amount, tx.type, tx.category, tx.date, tx.description]
      );
    }

    console.log('Sample data added successfully');
    console.log('\nTest Logins:');
    console.log('   Admin:    admin@test.com / password123');
    console.log('   Analyst:  analyst@test.com / password123');
    console.log('   Viewer:   viewer@test.com / password123');
  }

  return db;
}

// Middleware to attach database to every request
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Setup all routes
function setupRoutes() {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));        
  app.use('/api/transactions', require('./routes/transactionRoutes'));
  app.use('/api/dashboard', require('./routes/dashboardRoutes'));
}

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// Start the server
const PORT = process.env.PORT || 3000;

initializeDB()
  .then(() => {
    setupRoutes();
    app.listen(PORT, () => {
      console.log(`\nServer running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });