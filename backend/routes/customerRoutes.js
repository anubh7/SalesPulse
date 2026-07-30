/**
 * Customer Routes
 */

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticate } = require('../middleware/auth');

// All customer routes require authentication
router.use(authenticate);

// GET /api/customers - Get all customers
router.get('/', customerController.getAll);

// GET /api/customers/top - Get top customers
router.get('/top', customerController.getTopCustomers);

// GET /api/customers/:id - Get single customer
router.get('/:id', customerController.getById);

// POST /api/customers - Create customer
router.post('/', customerController.create);

// PUT /api/customers/:id - Update customer
router.put('/:id', customerController.update);

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', customerController.delete);

module.exports = router;