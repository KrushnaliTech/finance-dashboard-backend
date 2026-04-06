const express = require('express');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

// All user routes require authentication and admin role
router.use(authenticate);
router.use(checkRole(['admin']));

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get single user
router.get('/:id', getUserById);

// POST /api/users - Create new user
router.post('/', createUser);

// PUT /api/users/:id - Update user
router.put('/:id', updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

module.exports = router;