// Common validation functions

// Check if email format is valid
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check if date format is valid (YYYY-MM-DD)
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

// Check if amount is positive number
function isValidAmount(amount) {
  return !isNaN(amount) && amount > 0;
}

// Validate transaction input
function validateTransactionInput(data) {
  const errors = [];
  
  if (!data.amount) {
    errors.push('Amount is required');
  } else if (!isValidAmount(data.amount)) {
    errors.push('Amount must be a positive number');
  }
  
  if (!data.type) {
    errors.push('Type is required');
  } else if (!['income', 'expense'].includes(data.type)) {
    errors.push('Type must be income or expense');
  }
  
  if (!data.category) {
    errors.push('Category is required');
  }
  
  if (!data.date) {
    errors.push('Date is required');
  } else if (!isValidDate(data.date)) {
    errors.push('Date must be in YYYY-MM-DD format');
  }
  
  return errors;
}

// Validate user input
function validateUserInput(data) {
  const errors = [];
  
  if (!data.name) {
    errors.push('Name is required');
  }
  
  if (!data.email) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Email format is invalid');
  }
  
  if (!data.password) {
    errors.push('Password is required');
  } else if (data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (data.role && !['viewer', 'analyst', 'admin'].includes(data.role)) {
    errors.push('Role must be viewer, analyst, or admin');
  }
  
  return errors;
}

// Sanitize input (remove dangerous characters)
function sanitizeString(str) {
  if (!str) return '';
  return str.trim().replace(/[<>]/g, '');
}

module.exports = {
  isValidEmail,
  isValidDate,
  isValidAmount,
  validateTransactionInput,
  validateUserInput,
  sanitizeString
};