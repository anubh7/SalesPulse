/**
 * Load sample data into the database
 * Reads and executes SQL files from the database/ directory
 */
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: __dirname + '/../backend/.env' });

async function loadSQLFile(connection, filepath) {
    const sql = fs.readFileSync(filepath, 'utf8');
    await connection.query(sql);
    console.log(`✅ Loaded: ${path.basename(filepath)}`);
}

async function main() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'salespulse',
        multipleStatements: true
    });

    try {
        // Disable FK checks for safe truncation
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // Load customers first (sales depend on them)
        await loadSQLFile(connection, path.join(__dirname, 'retailmax_customers.sql'));

        // Load products (sales depend on them)
        await loadSQLFile(connection, path.join(__dirname, 'retailmax_products.sql'));

        // Load sales (20 batch files)
        for (let i = 1; i <= 20; i++) {
            const batchFile = path.join(__dirname, `retailmax_sales_batch_${i}.sql`);
            if (fs.existsSync(batchFile)) {
                await loadSQLFile(connection, batchFile);
            }
        }

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // Verify counts
        const customerCount = await connection.query('SELECT COUNT(*) as count FROM customers');
        const productCount = await connection.query('SELECT COUNT(*) as count FROM products');
        const saleCount = await connection.query('SELECT COUNT(*) as count FROM sales');

        console.log('\n📊 Database loaded successfully!');
        console.log(`   Customers: ${customerCount[0][0].count}`);
        console.log(`   Products:  ${productCount[0][0].count}`);
        console.log(`   Sales:     ${saleCount[0][0].count}`);
    } catch (error) {
        console.error('❌ Error loading data:', error.message);
    } finally {
        await connection.end();
    }
}

main();
