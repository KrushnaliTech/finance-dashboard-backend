const bcrypt = require('bcryptjs');
const { validateUser } = require('../models/User');

// Get all users
async function getAllUsers(req, res) {
  const db = req.db;
  
  try {
    const users = await db.all('SELECT id, name, email, role, status, created_at FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get single user by ID
async function getUserById(req, res) {
  const { id } = req.params;
  const db = req.db;
  
  try {
    const user = await db.get(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
      [id]
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Create new user
async function createUser(req, res) {
  const { name, email, password, role, status } = req.body;
  const db = req.db;
  
  // Validate input
  const errors = validateUser({ name, email, password, role, status });
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  try {
    // Check if email already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const result = await db.run(
      'INSERT INTO users (name, email, `password`, role, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'viewer', status || 'active']
    );
    
    // Return created user (without password)
    const newUser = await db.get(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
      [result.lastID]
    );
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update user
async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, role, status } = req.body;
  const db = req.db;
  
  try {
    // Check if user exists
    const existingUser = await db.get('SELECT id FROM users WHERE id = ?', [id]);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Build update query dynamically
    const updates = [];
    const values = [];
    
    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (role) {
      updates.push('role = ?');
      values.push(role);
    }
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    await db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    
    // Return updated user
    const updatedUser = await db.get(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
      [id]
    );
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete user
async function deleteUser(req, res) {
  const { id } = req.params;
  const db = req.db;
  
  try {
    // Don't allow deleting yourself
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    const result = await db.run('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };