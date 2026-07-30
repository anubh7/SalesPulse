/**
 * Dashboard Controller
 * Provides aggregated data for the dashboard
 */

const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// Get dashboard summary data
exports.getSummary = async (req, res) => {
    try {
        const stats = await Sale.getDashboardStats();
        const totalCustomers = await Customer.getCount();
        const totalOrders = await Sale.getTotalOrders();

        res.json({
            success: true,
            data: {
                total_revenue: stats.total_revenue,
                total_orders: totalOrders,
                total_items: stats.total_items,
                total_customers: totalCustomers,
                avg_order_value: stats.avg_order_value
            }
        });
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({ success: false, message: 'Error fetching dashboard summary' });
    }
};

// Get monthly sales chart data
exports.getMonthlySales = async (req, res) => {
    try {
        const year = req.query.year || new Date().getFullYear();
        const monthlyData = await Sale.getMonthlySummary(year);

        // Format for chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartData = months.map((name, index) => {
            const monthData = monthlyData.find(d => d.month === index + 1);
            return {
                month: name,
                revenue: monthData ? parseFloat(monthData.total_revenue) : 0,
                orders: monthData ? monthData.total_sales : 0,
                quantity: monthData ? monthData.total_quantity : 0
            };
        });

        res.json({ success: true, data: chartData });
    } catch (error) {
        console.error('Monthly sales error:', error);
        res.status(500).json({ success: false, message: 'Error fetching monthly sales data' });
    }
};

// Get top selling products
exports.getTopProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const products = await Product.getTopSelling(limit);
        res.json({ success: true, data: products });
    } catch (error) {
        console.error('Top products error:', error);
        res.status(500).json({ success: false, message: 'Error fetching top products' });
    }
};

// Get top customers
exports.getTopCustomers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const customers = await Customer.getTopCustomers(limit);
        res.json({ success: true, data: customers });
    } catch (error) {
        console.error('Top customers error:', error);
        res.status(500).json({ success: false, message: 'Error fetching top customers' });
    }
};

// Get recent sales
exports.getRecentSales = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const sales = await Sale.getRecentSales(limit);
        res.json({ success: true, data: sales });
    } catch (error) {
        console.error('Recent sales error:', error);
        res.status(500).json({ success: false, message: 'Error fetching recent sales' });
    }
};