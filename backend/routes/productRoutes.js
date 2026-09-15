/**
 * Product Routes
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, requireRole } = require('../middleware/auth');

// All product routes require authentication
router.use(authenticate);

// GET /api/products - Get all products
router.get('/', productController.getAll);

// GET /api/products/top-selling - Get top selling products
router.get('/top-selling', productController.getTopSelling);

// GET /api/products/categories - Get product categories
router.get('/categories', productController.getCategories);

// GET /api/products/:id - Get single product
router.get('/:id', productController.getById);

// POST /api/products - Create product (admin & manager only)
router.post('/', requireRole('admin', 'manager'), productController.create);

// PUT /api/products/:id - Update product (admin & manager only)
router.put('/:id', requireRole('admin', 'manager'), productController.update);

// DELETE /api/products/:id - Delete product (admin & manager only)
router.delete('/:id', requireRole('admin', 'manager'), productController.delete);

module.exports = router;