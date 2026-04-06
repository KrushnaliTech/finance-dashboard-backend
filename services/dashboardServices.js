// Get total income
async function getTotalIncome(db, userId, role) {
  let query = 'SELECT SUM(amount) as total FROM transactions WHERE type = "income"';
  let params = [];
  
  if (role !== 'admin') {
    query += ' AND user_id = ?';
    params = [userId];
  }
  
  const result = await db.get(query, params);
  return result.total || 0;
}

// Get total expenses
async function getTotalExpenses(db, userId, role) {
  let query = 'SELECT SUM(amount) as total FROM transactions WHERE type = "expense"';
  let params = [];
  
  if (role !== 'admin') {
    query += ' AND user_id = ?';
    params = [userId];
  }
  
  const result = await db.get(query, params);
  return result.total || 0;
}

// Get category wise totals
async function getCategoryTotals(db, userId, role) {
  let query = `
    SELECT category, type, SUM(amount) as total 
    FROM transactions 
    WHERE 1=1
  `;
  let params = [];
  
  if (role !== 'admin') {
    query += ' AND user_id = ?';
    params = [userId];
  }
  
  query += ' GROUP BY category, type ORDER BY total DESC';
  
  return await db.all(query, params);
}

// Get last 5 transactions
async function getRecentTransactions(db, userId, role) {
  let query = 'SELECT * FROM transactions';
  let params = [];
  
  if (role !== 'admin') {
    query += ' WHERE user_id = ?';
    params = [userId];
  }
  
  query += ' ORDER BY date DESC LIMIT 5';
  
  return await db.all(query, params);
}

module.exports = {
  getTotalIncome,
  getTotalExpenses,
  getCategoryTotals,
  getRecentTransactions
};