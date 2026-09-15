-- ============================================
-- SalesPulse Sample Data
-- For testing and demonstration purposes
-- ============================================

USE salespulse;

-- ============================================
-- SAMPLE USERS
-- Passwords (real bcrypt hashes):
--   admin@salespulse.com / admin123
--   john@salespulse.com  / password123
--   sarah@salespulse.com / password123
-- ============================================
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@salespulse.com', '$2a$10$NA0k.J/qhIW5K1JmxjJmvufvZcStmiKdPZZZI6hw.fo7Q8VKCBk4.', 'admin'),
('John Manager', 'john@salespulse.com', '$2a$10$1Sc7qWd/kcDZONeSJld5T.iXJQeiAQ/kvMAjv2bMrCVXJGXTEcEz.', 'manager'),
('Sarah Staff', 'sarah@salespulse.com', '$2a$10$1Sc7qWd/kcDZONeSJld5T.iXJQeiAQ/kvMAjv2bMrCVXJGXTEcEz.', 'staff');

-- ============================================
-- SAMPLE PRODUCTS
-- ============================================
INSERT INTO products (name, category, price, cost, stock, description) VALUES
('iPhone 15 Pro', 'Electronics', 999.00, 750.00, 50, 'Apple iPhone 15 Pro with A17 Pro chip'),
('Samsung Galaxy S24', 'Electronics', 899.00, 680.00, 45, 'Samsung Galaxy S24 with AI features'),
('MacBook Air M3', 'Electronics', 1299.00, 950.00, 30, 'Apple MacBook Air with M3 chip'),
('Sony WH-1000XM5', 'Audio', 349.00, 250.00, 100, 'Sony wireless noise-cancelling headphones'),
('Nike Air Max 270', 'Footwear', 150.00, 90.00, 200, 'Nike Air Max 270 casual shoes'),
('Adidas Ultraboost', 'Footwear', 180.00, 110.00, 150, 'Adidas Ultraboost running shoes'),
('Levi\'s Jeans', 'Clothing', 69.00, 35.00, 300, 'Levi\'s classic fit jeans'),
('Ray-Ban Aviator', 'Accessories', 160.00, 80.00, 120, 'Ray-Ban classic aviator sunglasses'),
('KitchenAid Mixer', 'Home', 399.00, 250.00, 40, 'KitchenAid stand mixer professional'),
('Dyson V15 Vacuum', 'Home', 599.00, 400.00, 25, 'Dyson V15 Detect cordless vacuum'),
('Apple Watch Series 9', 'Electronics', 399.00, 290.00, 80, 'Apple Watch Series 9 smartwatch'),
('Samsung QLED TV 65\"', 'Electronics', 1499.00, 1100.00, 20, 'Samsung 65-inch QLED 4K TV'),
('iPad Air M2', 'Electronics', 599.00, 430.00, 60, 'Apple iPad Air with M2 chip'),
('Bose SoundLink Max', 'Audio', 299.00, 200.00, 90, 'Bose SoundLink portable speaker'),
('Rolex Submariner', 'Accessories', 8500.00, 5000.00, 5, 'Rolex Submariner luxury watch');

-- ============================================
-- SAMPLE CUSTOMERS
-- ============================================
INSERT INTO customers (name, email, phone, city, state) VALUES
('Rahul Sharma', 'rahul.sharma@email.com', '9876543210', 'Mumbai', 'Maharashtra'),
('Priya Patel', 'priya.patel@email.com', '9876543211', 'Delhi', 'Delhi'),
('Amit Singh', 'amit.singh@email.com', '9876543212', 'Bangalore', 'Karnataka'),
('Sneha Reddy', 'sneha.reddy@email.com', '9876543213', 'Hyderabad', 'Telangana'),
('Vikram Joshi', 'vikram.joshi@email.com', '9876543214', 'Pune', 'Maharashtra'),
('Ananya Gupta', 'ananya.gupta@email.com', '9876543215', 'Chennai', 'Tamil Nadu'),
('Rohit Verma', 'rohit.verma@email.com', '9876543216', 'Kolkata', 'West Bengal'),
('Neha Kapoor', 'neha.kapoor@email.com', '9876543217', 'Ahmedabad', 'Gujarat'),
('Arjun Nair', 'arjun.nair@email.com', '9876543218', 'Kochi', 'Kerala'),
('Meera Desai', 'meera.desai@email.com', '9876543219', 'Jaipur', 'Rajasthan'),
('Karan Mehta', 'karan.mehta@email.com', '9876543220', 'Chandigarh', 'Punjab'),
('Isha Saxena', 'isha.saxena@email.com', '9876543221', 'Lucknow', 'Uttar Pradesh'),
('Deepak Tiwari', 'deepak.tiwari@email.com', '9876543222', 'Bhopal', 'Madhya Pradesh'),
('Kavita Rao', 'kavita.rao@email.com', '9876543223', 'Visakhapatnam', 'Andhra Pradesh'),
('Siddharth Jain', 'siddharth.jain@email.com', '9876543224', 'Surat', 'Gujarat');

-- ============================================
-- SAMPLE SALES (Last 6 months)
-- ============================================
INSERT INTO sales (product_id, customer_id, user_id, quantity, unit_price, total_amount, discount, payment_method, sale_date) VALUES
-- January 2024
(1, 1, 1, 2, 999.00, 1998.00, 0.00, 'card', '2024-01-05'),
(3, 2, 1, 1, 1299.00, 1299.00, 0.00, 'online', '2024-01-08'),
(5, 3, 2, 3, 150.00, 450.00, 0.00, 'cash', '2024-01-12'),
(7, 4, 2, 5, 69.00, 345.00, 0.00, 'card', '2024-01-15'),
(9, 5, 3, 1, 399.00, 399.00, 0.00, 'online', '2024-01-18'),
(2, 6, 1, 1, 899.00, 899.00, 0.00, 'card', '2024-01-22'),
(4, 7, 2, 2, 349.00, 698.00, 0.00, 'cash', '2024-01-25'),
(6, 8, 3, 1, 180.00, 180.00, 0.00, 'online', '2024-01-28'),

-- February 2024
(1, 9, 1, 1, 999.00, 999.00, 0.00, 'card', '2024-02-02'),
(10, 10, 2, 1, 599.00, 599.00, 0.00, 'online', '2024-02-05'),
(5, 11, 3, 2, 150.00, 300.00, 0.00, 'cash', '2024-02-08'),
(8, 12, 1, 1, 160.00, 160.00, 0.00, 'card', '2024-02-12'),
(11, 13, 2, 1, 399.00, 399.00, 0.00, 'online', '2024-02-15'),
(3, 14, 3, 1, 1299.00, 1299.00, 0.00, 'card', '2024-02-18'),
(2, 15, 1, 2, 899.00, 1798.00, 50.00, 'card', '2024-02-22'),
(7, 1, 2, 4, 69.00, 276.00, 0.00, 'cash', '2024-02-25'),

-- March 2024
(4, 2, 3, 1, 349.00, 349.00, 0.00, 'online', '2024-03-01'),
(12, 3, 1, 1, 1499.00, 1499.00, 100.00, 'card', '2024-03-04'),
(6, 4, 2, 2, 180.00, 360.00, 0.00, 'cash', '2024-03-07'),
(1, 5, 3, 1, 999.00, 999.00, 0.00, 'card', '2024-03-10'),
(9, 6, 1, 1, 399.00, 399.00, 0.00, 'online', '2024-03-13'),
(5, 7, 2, 3, 150.00, 450.00, 0.00, 'cash', '2024-03-16'),
(13, 8, 3, 1, 599.00, 599.00, 0.00, 'card', '2024-03-19'),
(10, 9, 1, 1, 599.00, 599.00, 0.00, 'online', '2024-03-22'),
(3, 10, 2, 1, 1299.00, 1299.00, 0.00, 'card', '2024-03-25'),
(2, 11, 3, 1, 899.00, 899.00, 0.00, 'cash', '2024-03-28'),

-- April 2024
(14, 12, 1, 2, 299.00, 598.00, 0.00, 'card', '2024-04-02'),
(1, 13, 2, 1, 999.00, 999.00, 0.00, 'online', '2024-04-05'),
(7, 14, 3, 3, 69.00, 207.00, 0.00, 'cash', '2024-04-08'),
(11, 15, 1, 1, 399.00, 399.00, 0.00, 'card', '2024-04-11'),
(5, 1, 2, 2, 150.00, 300.00, 0.00, 'online', '2024-04-14'),
(8, 2, 3, 1, 160.00, 160.00, 0.00, 'cash', '2024-04-17'),
(12, 3, 1, 1, 1499.00, 1499.00, 0.00, 'card', '2024-04-20'),
(4, 4, 2, 1, 349.00, 349.00, 0.00, 'online', '2024-04-23'),
(6, 5, 3, 2, 180.00, 360.00, 0.00, 'cash', '2024-04-26'),
(9, 6, 1, 1, 399.00, 399.00, 0.00, 'card', '2024-04-29'),

-- May 2024
(2, 7, 2, 1, 899.00, 899.00, 0.00, 'online', '2024-05-02'),
(13, 8, 3, 2, 599.00, 1198.00, 0.00, 'card', '2024-05-05'),
(1, 9, 1, 1, 999.00, 999.00, 0.00, 'cash', '2024-05-08'),
(10, 10, 2, 1, 599.00, 599.00, 0.00, 'online', '2024-05-11'),
(3, 11, 3, 1, 1299.00, 1299.00, 0.00, 'card', '2024-05-14'),
(5, 12, 1, 3, 150.00, 450.00, 0.00, 'cash', '2024-05-17'),
(14, 13, 2, 1, 299.00, 299.00, 0.00, 'online', '2024-05-20'),
(7, 14, 3, 5, 69.00, 345.00, 0.00, 'card', '2024-05-23'),
(11, 15, 1, 1, 399.00, 399.00, 0.00, 'cash', '2024-05-26'),
(4, 1, 2, 2, 349.00, 698.00, 0.00, 'online', '2024-05-29'),

-- June 2024
(1, 2, 3, 3, 999.00, 2997.00, 0.00, 'card', '2024-06-01'),
(8, 3, 1, 2, 160.00, 320.00, 0.00, 'cash', '2024-06-04'),
(12, 4, 2, 1, 1499.00, 1499.00, 0.00, 'online', '2024-06-07'),
(2, 5, 3, 1, 899.00, 899.00, 0.00, 'card', '2024-06-10'),
(6, 6, 1, 2, 180.00, 360.00, 0.00, 'cash', '2024-06-13'),
(9, 7, 2, 1, 399.00, 399.00, 0.00, 'online', '2024-06-16'),
(13, 8, 3, 1, 599.00, 599.00, 0.00, 'card', '2024-06-19'),
(5, 9, 1, 3, 150.00, 450.00, 0.00, 'cash', '2024-06-22'),
(3, 10, 2, 1, 1299.00, 1299.00, 0.00, 'online', '2024-06-25'),
(10, 11, 3, 1, 599.00, 599.00, 0.00, 'card', '2024-06-28');