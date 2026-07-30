/**
 * Customer Controller
 * Handles CRUD operations for customers
 */

const Customer = require('../models/Customer');

// Get all customers
exports.getAll = async (req, res) => {
    try {
        const { search } = req.query;
        const customers = await Customer.getAll(search);
        res.json({ success: true, customers });
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ success: false, message: 'Error fetching customers' });
    }
};

// Get single customer
exports.getById = async (req, res) => {
    try {
        const customer = await Customer.getById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.json({ success: true, customer });
    } catch (error) {
        console.error('Get customer error:', error);
        res.status(500).json({ success: false, message: 'Error fetching customer' });
    }
};

// Create customer
exports.create = async (req, res) => {
    try {
        const { name, email, phone, city, state } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Customer name is required' });
        }

        const id = await Customer.create({ name, email, phone, city, state });
        const customer = await Customer.getById(id);
        res.status(201).json({ success: true, message: 'Customer created successfully', customer });
    } catch (error) {
        console.error('Create customer error:', error);
        res.status(500).json({ success: false, message: 'Error creating customer' });
    }
};

// Update customer
exports.update = async (req, res) => {
    try {
        const existing = await Customer.getById(req.params.id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        const { name, email, phone, city, state } = req.body;
        await Customer.update(req.params.id, { name, email, phone, city, state });
        const customer = await Customer.getById(req.params.id);
        res.json({ success: true, message: 'Customer updated successfully', customer });
    } catch (error) {
        console.error('Update customer error:', error);
        res.status(500).json({ success: false, message: 'Error updating customer' });
    }
};

// Delete customer
exports.delete = async (req, res) => {
    try {
        const existing = await Customer.getById(req.params.id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        await Customer.delete(req.params.id);
        res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({ success: false, message: 'Error deleting customer' });
    }
};

// Get top customers
exports.getTopCustomers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const customers = await Customer.getTopCustomers(limit);
        res.json({ success: true, customers });
    } catch (error) {
        console.error('Top customers error:', error);
        res.status(500).json({ success: false, message: 'Error fetching top customers' });
    }
};