/**
 * Sale Controller
 * Handles CRUD operations for sales
 */

const Sale = require('../models/Sale');

// Get all sales (with filters and pagination)
exports.getAll = async (req, res) => {
    try {
        const filters = {
            search: req.query.search,
            start_date: req.query.start_date,
            end_date: req.query.end_date,
            product_id: req.query.product_id,
            customer_id: req.query.customer_id,
            region: req.query.region,
            order_status: req.query.order_status,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20
        };

        const result = await Sale.getAll(filters);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('Get sales error:', error);
        res.status(500).json({ success: false, message: 'Error fetching sales' });
    }
};

// Get single sale
exports.getById = async (req, res) => {
    try {
        const sale = await Sale.getById(req.params.id);
        if (!sale) {
            return res.status(404).json({ success: false, message: 'Sale not found' });
        }
        res.json({ success: true, sale });
    } catch (error) {
        console.error('Get sale error:', error);
        res.status(500).json({ success: false, message: 'Error fetching sale' });
    }
};

// Create sale
exports.create = async (req, res) => {
    try {
        const { product_id, customer_id, quantity, unit_price, discount, payment_method, sale_date, sales_executive, region, order_status } = req.body;

        // Validate required fields
        if (!product_id || !customer_id || !quantity || !unit_price || !sale_date) {
            return res.status(400).json({ 
                success: false, 
                message: 'Product, customer, quantity, unit price, and sale date are required' 
            });
        }

        // Calculate total amount
        const total_amount = (quantity * unit_price) - (discount || 0);

        const saleData = {
            product_id,
            customer_id,
            user_id: req.user.id, // Logged in user
            quantity,
            unit_price,
            total_amount,
            discount: discount || 0,
            payment_method: payment_method || 'cash',
            sale_date,
            sales_executive: sales_executive || null,
            region: region || null,
            order_status: order_status || 'delivered'
        };

        const id = await Sale.create(saleData);
        const sale = await Sale.getById(id);
        res.status(201).json({ success: true, message: 'Sale created successfully', sale });
    } catch (error) {
        console.error('Create sale error:', error);
        res.status(500).json({ success: false, message: 'Error creating sale' });
    }
};

// Update sale
exports.update = async (req, res) => {
    try {
        const existing = await Sale.getById(req.params.id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Sale not found' });
        }

        const { product_id, customer_id, quantity, unit_price, discount, payment_method, sale_date, sales_executive, region, order_status } = req.body;
        const total_amount = (quantity * unit_price) - (discount || 0);

        await Sale.update(req.params.id, {
            product_id, customer_id, quantity, unit_price, total_amount, 
            discount: discount || 0, payment_method, sale_date,
            sales_executive: sales_executive !== undefined ? sales_executive : existing.sales_executive,
            region: region !== undefined ? region : existing.region,
            order_status: order_status !== undefined ? order_status : existing.order_status
        });

        const sale = await Sale.getById(req.params.id);
        res.json({ success: true, message: 'Sale updated successfully', sale });
    } catch (error) {
        console.error('Update sale error:', error);
        res.status(500).json({ success: false, message: 'Error updating sale' });
    }
};

// Delete sale
exports.delete = async (req, res) => {
    try {
        const existing = await Sale.getById(req.params.id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Sale not found' });
        }

        await Sale.delete(req.params.id);
        res.json({ success: true, message: 'Sale deleted successfully' });
    } catch (error) {
        console.error('Delete sale error:', error);
        res.status(500).json({ success: false, message: 'Error deleting sale' });
    }
};