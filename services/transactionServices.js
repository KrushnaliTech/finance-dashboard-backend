// Create a new transaction
async function createTransaction(db, data) {
  const { user_id, amount, type, category, date, description } = data;
  
  const result = await db.run(
    `INSERT INTO transactions (user_id, amount, type, category, date, description) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, amount, type, category, date, description]
  );
  
  return { id: result.lastID, ...data };
}

// Get transactions (filter by role)
async function getTransactionsByUser(db, userId, role) {
  // Admin sees all transactions
  if (role === 'admin') {
    return await db.all('SELECT * FROM transactions ORDER BY date DESC');
  }
  
  // Other users see only their own transactions
  return await db.all(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
    [userId]
  );
}

// Update a transaction
async function updateTransaction(db, id, userId, role, updates) {
  // Non-admin can only update their own transactions
  if (role !== 'admin') {
    const transaction = await db.get('SELECT * FROM transactions WHERE id = ?', [id]);
    if (!transaction || transaction.user_id !== userId) {
      return null;
    }
  }
  
  await db.run(
    `UPDATE transactions 
     SET amount = ?, type = ?, category = ?, date = ?, description = ? 
     WHERE id = ?`,
    [updates.amount, updates.type, updates.category, updates.date, updates.description, id]
  );
  
  return { id, ...updates };
}

// Delete a transaction
async function deleteTransaction(db, id, userId, role) {
  // Non-admin can only delete their own transactions
  if (role !== 'admin') {
    const transaction = await db.get('SELECT * FROM transactions WHERE id = ?', [id]);
    if (!transaction || transaction.user_id !== userId) {
      return false;
    }
  }
  
  const result = await db.run('DELETE FROM transactions WHERE id = ?', [id]);
  return result.changes > 0;
}

// Get transactions with filters
async function getTransactionsWithFilters(db, userId, role, filters) {
  let query = 'SELECT * FROM transactions';
  let conditions = [];
  let params = [];
  
  // Role-based filtering
  if (role !== 'admin') {
    conditions.push('user_id = ?');
    params.push(userId);
  }
  
  // Date filter
  if (filters.startDate) {
    conditions.push('date >= ?');
    params.push(filters.startDate);
  }
  if (filters.endDate) {
    conditions.push('date <= ?');
    params.push(filters.endDate);
  }
  
  // Category filter
  if (filters.category) {
    conditions.push('category = ?');
    params.push(filters.category);
  }
  
  // Type filter
  if (filters.type && ['income', 'expense'].includes(filters.type)) {
    conditions.push('type = ?');
    params.push(filters.type);
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' ORDER BY date DESC';
  
  return await db.all(query, params);
}

module.exports = {
  createTransaction,
  getTransactionsByUser,
  updateTransaction,
  deleteTransaction,
  getTransactionsWithFilters  // ADD THIS
};
