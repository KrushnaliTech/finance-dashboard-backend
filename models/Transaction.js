// Transaction model schema definition

const TransactionSchema = {
  tableName: 'transactions',
  
  // All fields in the transactions table
  fields: ['id', 'user_id', 'amount', 'type', 'category', 'date', 'description', 'created_at'],
  
  // Valid transaction types
  validTypes: ['income', 'expense'],
  
  // Required fields when creating a transaction
  requiredFields: ['amount', 'type', 'category', 'date']
};

// Helper function to validate transaction data
function validateTransaction(transactionData) {
  const errors = [];
  
  if (!transactionData.amount) {
    errors.push('Amount is required');
  } else if (isNaN(transactionData.amount) || transactionData.amount <= 0) {
    errors.push('Amount must be a positive number');
  }
  
  if (!transactionData.type) {
    errors.push('Type is required');
  } else if (!TransactionSchema.validTypes.includes(transactionData.type)) {
    errors.push(`Type must be one of: ${TransactionSchema.validTypes.join(', ')}`);
  }
  
  if (!transactionData.category) {
    errors.push('Category is required');
  }
  
  if (!transactionData.date) {
    errors.push('Date is required');
  } else if (isNaN(Date.parse(transactionData.date))) {
    errors.push('Date must be a valid date');
  }
  
  return errors;
}

module.exports = { TransactionSchema, validateTransaction };