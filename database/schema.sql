-- ============================================
-- SalesPulse Database Schema
-- Sales Analytics & Management System
-- Company: RetailMax Pvt. Ltd.
-- ============================================

CREATE DATABASE IF NOT EXISTS salespulse;
USE salespulse;

-- ============================================
-- USERS TABLE
-- Stores user authentication information
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- CUSTOMERS TABLE
-- Stores customer information
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100),
    region VARCHAR(50),
    total_purchases DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- PRODUCTS TABLE
-- Stores product inventory information
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) DEFAULT 0.00,
    stock INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- SALES TABLE
-- Stores individual sales transactions
-- ============================================
CREATE TABLE IF NOT EXISTS sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,
    user_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    payment_method ENUM('cash', 'card', 'online', 'upi') DEFAULT 'cash',
    sale_date DATE NOT NULL,
    sales_executive VARCHAR(100),
    region VARCHAR(50),
    order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'delivered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES for better query performance
-- ============================================
CREATE INDEX idx_sale_date ON sales(sale_date);
CREATE INDEX idx_product_id ON sales(product_id);
CREATE INDEX idx_customer_id ON sales(customer_id);
CREATE INDEX idx_user_id ON sales(user_id);
CREATE INDEX idx_sales_region ON sales(region);
CREATE INDEX idx_order_status ON sales(order_status);
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_customer_city ON customers(city);
CREATE INDEX idx_customer_region ON customers(region);