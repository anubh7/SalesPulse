/**
 * Report Controller
 * Handles analytics reports and Excel import/export
 */

const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const XLSX = require('xlsx');
const path = require('path');

// Get monthly revenue analysis
exports.getMonthlyRevenue = async (req, res) => {
    try {
        const year = req.query.year || new Date().getFullYear();
        const data = await Sale.getMonthlySummary(year);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Monthly revenue error:', error);
        res.status(500).json({ success: false, message: 'Error fetching monthly revenue' });
    }
};

// Get product-wise sales analysis
exports.getProductWiseAnalysis = async (req, res) => {
    try {
        const data = await Sale.getProductWiseAnalysis();
        res.json({ success: true, data });
    } catch (error) {
        console.error('Product analysis error:', error);
        res.status(500).json({ success: false, message: 'Error fetching product analysis' });
    }
};

// Get customer-wise analysis
exports.getCustomerWiseAnalysis = async (req, res) => {
    try {
        const data = await Sale.getCustomerWiseAnalysis();
        res.json({ success: true, data });
    } catch (error) {
        console.error('Customer analysis error:', error);
        res.status(500).json({ success: false, message: 'Error fetching customer analysis' });
    }
};

// Get sales trends
exports.getSalesTrends = async (req, res) => {
    try {
        const months = parseInt(req.query.months) || 6;
        const data = await Sale.getSalesTrends(months);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Sales trends error:', error);
        res.status(500).json({ success: false, message: 'Error fetching sales trends' });
    }
};

// Get revenue growth
exports.getRevenueGrowth = async (req, res) => {
    try {
        const data = await Sale.getRevenueGrowth();
        res.json({ success: true, data });
    } catch (error) {
        console.error('Revenue growth error:', error);
        res.status(500).json({ success: false, message: 'Error fetching revenue growth' });
    }
};

// Get top selling products
exports.getTopSellingProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const data = await Product.getTopSelling(limit);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Top selling error:', error);
        res.status(500).json({ success: false, message: 'Error fetching top products' });
    }
};

// Get best performing customers
exports.getBestCustomers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const data = await Customer.getTopCustomers(limit);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Best customers error:', error);
        res.status(500).json({ success: false, message: 'Error fetching best customers' });
    }
};

// Generate and download monthly report as Excel
exports.downloadMonthlyReport = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || (new Date().getMonth() + 1);

        const sales = await Sale.getMonthlyReport(year, month);

        // Format data for Excel
        const excelData = sales.map(s => ({
            'Sale ID': s.id,
            'Date': s.sale_date,
            'Product': s.product_name,
            'Category': s.category,
            'Customer': s.customer_name,
            'Customer Email': s.customer_email,
            'Sales Person': s.user_name,
            'Quantity': s.quantity,
            'Unit Price': s.unit_price,
            'Total Amount': s.total_amount,
            'Discount': s.discount,
            'Payment Method': s.payment_method
        }));

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Add column widths
        ws['!cols'] = [
            { wch: 8 }, { wch: 12 }, { wch: 25 }, { wch: 15 },
            { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 8 },
            { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 10 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

        // Add summary sheet
        const total = sales.reduce((acc, s) => acc + parseFloat(s.total_amount), 0);
        const summaryData = [
            { 'Metric': 'Month', 'Value': `${year}-${month.toString().padStart(2, '0')}` },
            { 'Metric': 'Total Sales', 'Value': sales.length },
            { 'Metric': 'Total Revenue', 'Value': total.toFixed(2) }
        ];
        const summaryWs = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

        // Generate buffer and send
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Sales_Report_${year}_${month}.xlsx`);
        res.send(buffer);
    } catch (error) {
        console.error('Download report error:', error);
        res.status(500).json({ success: false, message: 'Error generating report' });
    }
};

// Import sales data from Excel
exports.importExcel = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, message: 'Please upload an Excel file' });
        }

        const file = req.files.file;
        const wb = XLSX.read(file.data, { type: 'buffer' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
            return res.status(400).json({ success: false, message: 'No data found in file' });
        }

        // Map Excel columns to database fields
        const salesData = data.map(row => ({
            product_id: row['Product ID'] || row['product_id'],
            customer_id: row['Customer ID'] || row['customer_id'],
            user_id: row['User ID'] || row['user_id'] || req.user.id,
            quantity: row['Quantity'] || row['quantity'],
            unit_price: row['Unit Price'] || row['unit_price'],
            total_amount: row['Total Amount'] || row['total_amount'],
            discount: row['Discount'] || row['discount'] || 0,
            payment_method: row['Payment Method'] || row['payment_method'] || 'cash',
            sale_date: row['Sale Date'] || row['sale_date']
        }));

        // Validate required fields
        const invalidRows = salesData.filter(s => !s.product_id || !s.customer_id || !s.quantity || !s.unit_price || !s.sale_date);
        if (invalidRows.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid data. ${invalidRows.length} rows missing required fields.`
            });
        }

        await Sale.bulkInsert(salesData);
        res.json({
            success: true,
            message: `${salesData.length} sales records imported successfully`
        });
    } catch (error) {
        console.error('Import Excel error:', error);
        res.status(500).json({ success: false, message: 'Error importing Excel file' });
    }
};