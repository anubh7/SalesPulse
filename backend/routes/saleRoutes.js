/**
 * Sale Routes
 */

const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { authenticate, requireRole } = require('../middleware/auth');

// All sale routes require authentication
router.use(authenticate);

// GET /api/sales - Get all sales (with filters and pagination)
router.get('/', saleController.getAll);

// GET /api/sales/:id - Get single sale
router.get('/:id', saleController.getById);

// POST /api/sales - Create sale (any authenticated user, e.g. staff)
router.post('/', saleController.create);

// PUT /api/sales/:id - Update sale (admin & manager only)
router.put('/:id', requireRole('admin', 'manager'), saleController.update);

// DELETE /api/sales/:id - Delete sale (admin & manager only)
router.delete('/:id', requireRole('admin', 'manager'), saleController.delete);

module.exports = router;