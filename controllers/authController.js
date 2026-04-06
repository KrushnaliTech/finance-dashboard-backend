const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function login(req, res) {
  const { email, password } = req.body;
  const db = req.db;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    // Find user by email
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is disabled' });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Send response (exclude password)
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { login };