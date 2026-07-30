/**
 * User Model
 * Handles database operations for users table
 */

const { query } = require('../config/database');

const User = {
    // Create a new user
    create: async (userData) => {
        const { name, email, password, role } = userData;
        const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        const result = await query(sql, [name, email, password, role || 'staff']);
        return result.insertId;
    },

    // Find user by email
    findByEmail: async (email) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const users = await query(sql, [email]);
        return users[0] || null;
    },

    // Find user by ID
    findById: async (id) => {
        const sql = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
        const users = await query(sql, [id]);
        return users[0] || null;
    },

    // Get all users
    getAll: async () => {
        const sql = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
        return await query(sql);
    },

    // Update user
    update: async (id, userData) => {
        const { name, email, role } = userData;
        const sql = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
        return await query(sql, [name, email, role, id]);
    },

    // Delete user
    delete: async (id) => {
        const sql = 'DELETE FROM users WHERE id = ?';
        return await query(sql, [id]);
    }
};

module.exports = User;