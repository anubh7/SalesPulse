/**
 * Report Routes
 */

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');

// All report routes require authentication
router.use(authenticate);

// GET /api/reports/monthly-revenue - Monthly revenue analysis
router.get('/monthly-revenue', reportController.getMonthlyRevenue);

// GET /api/reports/product-analysis - Product-wise sales analysis
router.get('/product-analysis', reportController.getProductWiseAnalysis);

// GET /api/reports/customer-analysis - Customer-wise analysis
router.get('/customer-analysis', reportController.getCustomerWiseAnalysis);

// GET /api/reports/sales-trends - Sales trends
router.get('/sales-trends', reportController.getSalesTrends);

// GET /api/reports/revenue-growth - Revenue growth
router.get('/revenue-growth', reportController.getRevenueGrowth);

// GET /api/reports/top-products - Top selling products
router.get('/top-products', reportController.getTopSellingProducts);

// GET /api/reports/best-customers - Best performing customers
router.get('/best-customers', reportController.getBestCustomers);

// GET /api/reports/download-monthly - Download monthly report as Excel
router.get('/download-monthly', reportController.downloadMonthlyReport);

// POST /api/reports/import-excel - Import sales data from Excel
router.post('/import-excel', reportController.importExcel);

module.exports = router;