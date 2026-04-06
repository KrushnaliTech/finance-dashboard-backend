const express = require('express');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const { getSummary } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/summary', authenticate, checkRole(['analyst', 'admin']), getSummary);

module.exports = router;