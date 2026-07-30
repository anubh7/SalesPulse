/**
 * Dashboard Routes
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

// All dashboard routes require authentication
router.use(authenticate);

// GET /api/dashboard/summary - Get dashboard summary stats
router.get('/summary', dashboardController.getSummary);

// GET /api/dashboard/monthly-sales - Get monthly sales chart data
router.get('/monthly-sales', dashboardController.getMonthlySales);

// GET /api/dashboard/top-products - Get top selling products
router.get('/top-products', dashboardController.getTopProducts);

// GET /api/dashboard/top-customers - Get top customers
router.get('/top-customers', dashboardController.getTopCustomers);

// GET /api/dashboard/recent-sales - Get recent sales
router.get('/recent-sales', dashboardController.getRecentSales);

module.exports = router;