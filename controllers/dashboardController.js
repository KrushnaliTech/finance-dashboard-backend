const dashboardService = require('../services/dashboardServices');

async function getSummary(req, res) {
  const db = req.db;
  const userId = req.user.id;
  const userRole = req.user.role;
  
  try {
    const totalIncome = await dashboardService.getTotalIncome(db, userId, userRole);
    const totalExpenses = await dashboardService.getTotalExpenses(db, userId, userRole);
    const categoryTotals = await dashboardService.getCategoryTotals(db, userId, userRole);
    const recentTransactions = await dashboardService.getRecentTransactions(db, userId, userRole);
    
    const netBalance = totalIncome - totalExpenses;
    
    res.json({
      totalIncome,
      totalExpenses,
      netBalance,
      categoryTotals,
      recentTransactions
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getSummary };