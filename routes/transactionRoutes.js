const express = require('express');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const { create, getAll, update, remove } = require('../controllers/transactionController');

const router = express.Router();

// All transaction routes need authentication
router.use(authenticate);

// GET - Anyone logged in can view transactions
router.get('/', checkRole(['viewer', 'analyst', 'admin']), getAll);

// POST - Only admin can create transactions
router.post('/', checkRole(['admin']), create);

// PUT - Only admin can update transactions
router.put('/:id', checkRole(['admin']), update);

// DELETE - Only admin can delete transactions
router.delete('/:id', checkRole(['admin']), remove);

module.exports = router;