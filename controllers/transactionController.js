const transactionService = require('../services/transactionServices');

// Create a new transaction
async function create(req, res) {
  const { amount, type, category, date, description } = req.body;
  const userId = req.user.id;
  const db = req.db;
  
  // Validate required fields
  if (!amount || !type || !category || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const transaction = await transactionService.createTransaction(db, {
      user_id: userId,
      amount,
      type,
      category,
      date,
      description
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all transactions (with optional filters)
async function getAll(req, res) {
  const db = req.db;
  const userId = req.user.id;
  const userRole = req.user.role;
  
  // Get filter parameters from query string
  const { startDate, endDate, category, type } = req.query;
  
  try {
    const transactions = await transactionService.getTransactionsWithFilters(
      db, userId, userRole, { startDate, endDate, category, type }
    );
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a transaction
async function update(req, res) {
  const { id } = req.params;
  const { amount, type, category, date, description } = req.body;
  const db = req.db;
  const userId = req.user.id;
  const userRole = req.user.role;
  
  try {
    const updated = await transactionService.updateTransaction(db, parseInt(id), userId, userRole, {
      amount, type, category, date, description
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete a transaction
async function remove(req, res) {
  const { id } = req.params;
  const db = req.db;
  const userId = req.user.id;
  const userRole = req.user.role;
  
  try {
    const deleted = await transactionService.deleteTransaction(db, parseInt(id), userId, userRole);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { create, getAll, update, remove };