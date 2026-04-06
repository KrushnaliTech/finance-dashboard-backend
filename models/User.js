// User model schema definition
// This file documents the user structure

const UserSchema = {
  tableName: 'users',
  
  // All fields in the users table
  fields: ['id', 'name', 'email', 'password', 'role', 'status', 'created_at'],
  
  // Valid role values
  validRoles: ['viewer', 'analyst', 'admin'],
  
  // Valid status values
  validStatuses: ['active', 'inactive'],
  
  // Fields that are required when creating a user
  requiredFields: ['name', 'email', 'password']
};

// Helper function to validate user data
function validateUser(userData) {
  const errors = [];
  
  if (!userData.name) errors.push('Name is required');
  if (!userData.email) errors.push('Email is required');
  if (!userData.password) errors.push('Password is required');
  
  if (userData.role && !UserSchema.validRoles.includes(userData.role)) {
    errors.push(`Role must be one of: ${UserSchema.validRoles.join(', ')}`);
  }
  
  if (userData.status && !UserSchema.validStatuses.includes(userData.status)) {
    errors.push(`Status must be one of: ${UserSchema.validStatuses.join(', ')}`);
  }
  
  return errors;
}

module.exports = { UserSchema, validateUser };