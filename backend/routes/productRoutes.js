/**
 * Product Routes
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');

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

// POST /api/products - Create product
router.post('/', productController.create);

// PUT /api/products/:id - Update product
router.put('/:id', productController.update);

// DELETE /api/products/:id - Delete product
router.delete('/:id', productController.delete);

module.exports = router;