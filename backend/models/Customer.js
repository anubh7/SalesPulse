/**
 * Customer Model
 * Handles database operations for customers table
 */

const { query } = require('../config/database');

const Customer = {
    // Create a new customer
    create: async (customerData) => {
        const { name, email, phone, city, state } = customerData;
        const sql = 'INSERT INTO customers (name, email, phone, city, state) VALUES (?, ?, ?, ?, ?)';
        const result = await query(sql, [name, email, phone, city, state]);
        return result.insertId;
    },

    // Get all customers with optional search
    getAll: async (search = '') => {
        let sql = 'SELECT * FROM customers';
        let params = [];
        if (search) {
            sql += ' WHERE name LIKE ? OR email LIKE ? OR city LIKE ? OR phone LIKE ?';
            params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
        }
        sql += ' ORDER BY created_at DESC';
        return await query(sql, params);
    },

    // Get customer by ID
    getById: async (id) => {
        const sql = 'SELECT * FROM customers WHERE id = ?';
        const customers = await query(sql, [id]);
        return customers[0] || null;
    },

    // Update customer
    update: async (id, customerData) => {
        const { name, email, phone, city, state } = customerData;
        const sql = 'UPDATE customers SET name = ?, email = ?, phone = ?, city = ?, state = ? WHERE id = ?';
        return await query(sql, [name, email, phone, city, state, id]);
    },

    // Delete customer
    delete: async (id) => {
        const sql = 'DELETE FROM customers WHERE id = ?';
        return await query(sql, [id]);
    },

    // Get top customers by purchase amount
    getTopCustomers: async (limit = 5) => {
        const sql = `
            SELECT c.id, c.name, c.email, c.city,
                   COUNT(s.id) as total_orders,
                   SUM(s.total_amount) as total_spent
            FROM customers c
            LEFT JOIN sales s ON c.id = s.customer_id
            GROUP BY c.id
            ORDER BY total_spent DESC
            LIMIT ${parseInt(limit)}
        `;
        return await query(sql);
    },

    // Get customer count
    getCount: async () => {
        const sql = 'SELECT COUNT(*) as count FROM customers';
        const result = await query(sql);
        return result[0].count;
    }
};

module.exports = Customer;