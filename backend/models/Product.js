/**
 * Product Model
 * Handles database operations for products table
 */

const { query } = require('../config/database');

const Product = {
    // Create a new product
    create: async (productData) => {
        const { name, category, price, cost, stock, description } = productData;
        const sql = 'INSERT INTO products (name, category, price, cost, stock, description) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await query(sql, [name, category, price, cost || 0, stock || 0, description || '']);
        return result.insertId;
    },

    // Get all products with optional search
    getAll: async (search = '') => {
        let sql = 'SELECT * FROM products';
        let params = [];
        if (search) {
            sql += ' WHERE name LIKE ? OR category LIKE ?';
            params = [`%${search}%`, `%${search}%`];
        }
        sql += ' ORDER BY created_at DESC';
        return await query(sql, params);
    },

    // Get product by ID
    getById: async (id) => {
        const sql = 'SELECT * FROM products WHERE id = ?';
        const products = await query(sql, [id]);
        return products[0] || null;
    },

    // Update product
    update: async (id, productData) => {
        const { name, category, price, cost, stock, description } = productData;
        const sql = 'UPDATE products SET name = ?, category = ?, price = ?, cost = ?, stock = ?, description = ? WHERE id = ?';
        return await query(sql, [name, category, price, cost, stock, description, id]);
    },

    // Delete product
    delete: async (id) => {
        const sql = 'DELETE FROM products WHERE id = ?';
        return await query(sql, [id]);
    },

    // Get top selling products
    getTopSelling: async (limit = 5) => {
        const sql = `
            SELECT p.id, p.name, p.category, p.price, 
                   COUNT(s.id) as total_sales, 
                   SUM(s.quantity) as total_quantity,
                   SUM(s.total_amount) as total_revenue
            FROM products p
            LEFT JOIN sales s ON p.id = s.product_id
            GROUP BY p.id
            ORDER BY total_revenue DESC
            LIMIT ${parseInt(limit)}
        `;
        return await query(sql);
    },

    // Get product categories
    getCategories: async () => {
        const sql = 'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category';
        return await query(sql);
    }
};

module.exports = Product;