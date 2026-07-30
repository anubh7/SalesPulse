/**
 * Sale Model
 * Handles database operations for sales table
 */

const { query } = require('../config/database');

const Sale = {
    // Create a new sale
    create: async (saleData) => {
        const { product_id, customer_id, user_id, quantity, unit_price, total_amount, discount, payment_method, sale_date, sales_executive, region, order_status } = saleData;
        const sql = 'INSERT INTO sales (product_id, customer_id, user_id, quantity, unit_price, total_amount, discount, payment_method, sale_date, sales_executive, region, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await query(sql, [product_id, customer_id, user_id, quantity, unit_price, total_amount, discount || 0, payment_method || 'cash', sale_date, sales_executive || null, region || null, order_status || 'delivered']);
        return result.insertId;
    },

    // Get all sales with pagination, search, and filters
    getAll: async (filters = {}) => {
        let sql = `
            SELECT s.*, 
                   p.name as product_name, p.category as product_category,
                   c.name as customer_name, c.email as customer_email, c.city as customer_city,
                   u.name as user_name
            FROM sales s
            JOIN products p ON s.product_id = p.id
            JOIN customers c ON s.customer_id = c.id
            JOIN users u ON s.user_id = u.id
            WHERE 1=1
        `;
        let params = [];

        // Search filter
        if (filters.search) {
            sql += ' AND (p.name LIKE ? OR c.name LIKE ? OR c.email LIKE ? OR s.sales_executive LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        // Date range filter
        if (filters.start_date) {
            sql += ' AND s.sale_date >= ?';
            params.push(filters.start_date);
        }
        if (filters.end_date) {
            sql += ' AND s.sale_date <= ?';
            params.push(filters.end_date);
        }

        // Product filter
        if (filters.product_id) {
            sql += ' AND s.product_id = ?';
            params.push(filters.product_id);
        }

        // Customer filter
        if (filters.customer_id) {
            sql += ' AND s.customer_id = ?';
            params.push(filters.customer_id);
        }

        // Region filter
        if (filters.region) {
            sql += ' AND s.region = ?';
            params.push(filters.region);
        }

        // Order status filter
        if (filters.order_status) {
            sql += ' AND s.order_status = ?';
            params.push(filters.order_status);
        }

        // Pagination
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const offset = (page - 1) * limit;

        // Count total results
        const countSql = sql.replace(/SELECT s\.\*,[\s\S]*?u\.name as user_name/, 'SELECT COUNT(*) as total');
        const countResult = await query(countSql, params);
        const total = countResult[0].total;

        // Get paginated results
        sql += ` ORDER BY s.sale_date DESC, s.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        const sales = await query(sql, params);

        return { sales, total, page, totalPages: Math.ceil(total / limit) };
    },

    // Get sale by ID
    getById: async (id) => {
        const sql = `
            SELECT s.*, 
                   p.name as product_name, p.category as product_category, p.price as product_price,
                   c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.city as customer_city,
                   u.name as user_name
            FROM sales s
            JOIN products p ON s.product_id = p.id
            JOIN customers c ON s.customer_id = c.id
            JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
        `;
        const sales = await query(sql, [id]);
        return sales[0] || null;
    },

    // Update sale
    update: async (id, saleData) => {
        const { product_id, customer_id, quantity, unit_price, total_amount, discount, payment_method, sale_date, sales_executive, region, order_status } = saleData;
        const sql = 'UPDATE sales SET product_id = ?, customer_id = ?, quantity = ?, unit_price = ?, total_amount = ?, discount = ?, payment_method = ?, sale_date = ?, sales_executive = ?, region = ?, order_status = ? WHERE id = ?';
        return await query(sql, [product_id, customer_id, quantity, unit_price, total_amount, discount, payment_method, sale_date, sales_executive, region, order_status, id]);
    },

    // Delete sale
    delete: async (id) => {
        const sql = 'DELETE FROM sales WHERE id = ?';
        return await query(sql, [id]);
    },

    // Get monthly sales summary
    getMonthlySummary: async (year = null) => {
        const currentYear = year || new Date().getFullYear();
        const sql = `
            SELECT 
                MONTH(s.sale_date) as month,
                COUNT(s.id) as total_sales,
                SUM(s.total_amount) as total_revenue,
                SUM(s.quantity) as total_quantity,
                AVG(s.total_amount) as avg_order_value
            FROM sales s
            WHERE YEAR(s.sale_date) = ?
            GROUP BY MONTH(s.sale_date)
            ORDER BY month
        `;
        return await query(sql, [currentYear]);
    },

    // Get product-wise sales analysis
    getProductWiseAnalysis: async () => {
        const sql = `
            SELECT p.id, p.name, p.category,
                   COUNT(s.id) as total_orders,
                   SUM(s.quantity) as total_quantity,
                   SUM(s.total_amount) as total_revenue,
                   AVG(s.total_amount) as avg_price
            FROM sales s
            JOIN products p ON s.product_id = p.id
            GROUP BY p.id, p.name, p.category
            ORDER BY total_revenue DESC
        `;
        return await query(sql);
    },

    // Get customer-wise analysis
    getCustomerWiseAnalysis: async () => {
        const sql = `
            SELECT c.id, c.name, c.email, c.city, c.region,
                   COUNT(s.id) as total_orders,
                   SUM(s.quantity) as total_items,
                   SUM(s.total_amount) as total_spent,
                   AVG(s.total_amount) as avg_order_value
            FROM sales s
            JOIN customers c ON s.customer_id = c.id
            GROUP BY c.id, c.name, c.email, c.city, c.region
            ORDER BY total_spent DESC
        `;
        return await query(sql);
    },

    // Get monthly report data
    getMonthlyReport: async (year, month) => {
        const sql = `
            SELECT s.*, p.name as product_name, p.category,
                   c.name as customer_name, c.email as customer_email,
                   u.name as user_name
            FROM sales s
            JOIN products p ON s.product_id = p.id
            JOIN customers c ON s.customer_id = c.id
            JOIN users u ON s.user_id = u.id
            WHERE YEAR(s.sale_date) = ? AND MONTH(s.sale_date) = ?
            ORDER BY s.sale_date DESC
        `;
        return await query(sql, [year, month]);
    },

    // Get sales trends
    getSalesTrends: async (months = 6) => {
        const sql = `
            SELECT 
                DATE_FORMAT(s.sale_date, '%Y-%m') as month,
                COUNT(s.id) as total_orders,
                SUM(s.total_amount) as total_revenue,
                SUM(s.quantity) as total_quantity,
                COUNT(DISTINCT s.customer_id) as unique_customers
            FROM sales s
            WHERE s.sale_date >= DATE_SUB(CURDATE(), INTERVAL ${parseInt(months)} MONTH)
            GROUP BY DATE_FORMAT(s.sale_date, '%Y-%m')
            ORDER BY month ASC
        `;
        return await query(sql);
    },

    // Get revenue growth (month-over-month)
    getRevenueGrowth: async () => {
        const sql = `
            SELECT 
                DATE_FORMAT(s.sale_date, '%Y-%m') as month,
                SUM(s.total_amount) as revenue,
                LAG(SUM(s.total_amount), 1) OVER (ORDER BY DATE_FORMAT(s.sale_date, '%Y-%m')) as prev_revenue,
                ROUND(((SUM(s.total_amount) - LAG(SUM(s.total_amount), 1) OVER (ORDER BY DATE_FORMAT(s.sale_date, '%Y-%m'))) / 
                LAG(SUM(s.total_amount), 1) OVER (ORDER BY DATE_FORMAT(s.sale_date, '%Y-%m'))) * 100, 2) as growth_percent
            FROM sales s
            GROUP BY DATE_FORMAT(s.sale_date, '%Y-%m')
            ORDER BY month ASC
        `;
        return await query(sql);
    },

    // Get dashboard summary stats
    getDashboardStats: async () => {
        const sql = `
            SELECT 
                COUNT(DISTINCT s.id) as total_orders,
                COALESCE(SUM(s.total_amount), 0) as total_revenue,
                COALESCE(SUM(s.quantity), 0) as total_items,
                COALESCE(AVG(s.total_amount), 0) as avg_order_value
            FROM sales s
        `;
        const result = await query(sql);
        return result[0];
    },

    // Get recent sales
    getRecentSales: async (limit = 5) => {
        const sql = `
            SELECT s.id, s.total_amount, s.sale_date, s.payment_method, s.sales_executive, s.order_status, s.region,
                   p.name as product_name,
                   c.name as customer_name
            FROM sales s
            JOIN products p ON s.product_id = p.id
            JOIN customers c ON s.customer_id = c.id
            ORDER BY s.created_at DESC
            LIMIT ${parseInt(limit)}
        `;
        return await query(sql);
    },

    // Get total orders count
    getTotalOrders: async () => {
        const sql = 'SELECT COUNT(*) as count FROM sales';
        const result = await query(sql);
        return result[0].count;
    },

    // Get all regions
    getRegions: async () => {
        const sql = 'SELECT DISTINCT region FROM sales WHERE region IS NOT NULL ORDER BY region';
        return await query(sql);
    },

    // Get order statuses
    getOrderStatuses: async () => {
        const sql = "SELECT DISTINCT order_status FROM sales WHERE order_status IS NOT NULL ORDER BY order_status";
        return await query(sql);
    },

    // Bulk insert sales (for Excel import)
    bulkInsert: async (salesData) => {
        const sql = 'INSERT INTO sales (product_id, customer_id, user_id, quantity, unit_price, total_amount, discount, payment_method, sale_date, sales_executive, region, order_status) VALUES ?';
        const values = salesData.map(s => [
            s.product_id, s.customer_id, s.user_id, 
            s.quantity, s.unit_price, s.total_amount, 
            s.discount || 0, s.payment_method || 'cash', s.sale_date,
            s.sales_executive || null, s.region || null, s.order_status || 'delivered'
        ]);
        return await query(sql, [values]);
    }
};

module.exports = Sale;