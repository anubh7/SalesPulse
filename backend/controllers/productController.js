/**
 * Product Controller
 * Handles CRUD operations for products
 */

const Product = require('../models/Product');

// Get all products
exports.getAll = async (req, res) => {
    try {
        const { search } = req.query;
        const products = await Product.getAll(search);
        res.json({ success: true, products });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ success: false, message: 'Error fetching products' });
    }
};

// Get single product
exports.getById = async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ success: false, message: 'Error fetching product' });
    }
};

// Create product
exports.create = async (req, res) => {
    try {
        const { name, category, price, cost, stock, description } = req.body;

        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Product name and price are required' });
        }

        const id = await Product.create({ name, category, price, cost, stock, description });
        const product = await Product.getById(id);
        res.status(201).json({ success: true, message: 'Product created successfully', product });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ success: false, message: 'Error creating product' });
    }
};

// Update product
exports.update = async (req, res) => {
    try {
        const { name, category, price, cost, stock, description } = req.body;

        const existing = await Product.getById(req.params.id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await Product.update(req.params.id, { name, category, price, cost, stock, description });
        const product = await Product.getById(req.params.id);
        res.json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ success: false, message: 'Error updating product' });
    }
};

// Delete product
exports.delete = async (req, res) => {
    try {
        const existing = await Product.getById(req.params.id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await Product.delete(req.params.id);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ success: false, message: 'Error deleting product' });
    }
};

// Get top selling products
exports.getTopSelling = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const products = await Product.getTopSelling(limit);
        res.json({ success: true, products });
    } catch (error) {
        console.error('Top selling error:', error);
        res.status(500).json({ success: false, message: 'Error fetching top selling products' });
    }
};

// Get categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Product.getCategories();
        res.json({ success: true, categories: categories.map(c => c.category) });
    } catch (error) {
        console.error('Categories error:', error);
        res.status(500).json({ success: false, message: 'Error fetching categories' });
    }
};