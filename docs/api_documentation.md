# SalesPulse API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header.
```
Authorization: Bearer <token>
```

## Endpoints

### 1. Authentication

#### POST /auth/register
Register a new user.
```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// Response (201)
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "staff"
  }
}
```

#### POST /auth/login
Login with existing credentials.
```json
// Request
{
  "email": "john@example.com",
  "password": "password123"
}

// Response (200)
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "staff"
  }
}
```

#### GET /auth/profile
Get current user profile. (Protected)

### 2. Dashboard

#### GET /dashboard/summary
Get dashboard summary statistics.

#### GET /dashboard/monthly-sales?year=2024
Get monthly sales chart data.

#### GET /dashboard/top-products?limit=5
Get top selling products.

#### GET /dashboard/top-customers?limit=5
Get top customers.

#### GET /dashboard/recent-sales?limit=5
Get recent sales.

### 3. Products

#### GET /products?search=iphone
Get all products with optional search.

#### GET /products/:id
Get single product by ID.

#### POST /products
Create a new product.
```json
{
  "name": "iPhone 15 Pro",
  "category": "Electronics",
  "price": 999.00,
  "cost": 750.00,
  "stock": 50,
  "description": "Apple iPhone 15 Pro"
}
```

#### PUT /products/:id
Update a product.

#### DELETE /products/:id
Delete a product.

### 4. Customers

#### GET /customers?search=rahul
Get all customers with optional search.

#### GET /customers/:id
Get single customer.

#### POST /customers
Create a new customer.
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@email.com",
  "phone": "9876543210",
  "city": "Mumbai",
  "state": "Maharashtra"
}
```

#### PUT /customers/:id
Update a customer.

#### DELETE /customers/:id
Delete a customer.

### 5. Sales

#### GET /sales?search=&start_date=&end_date=&product_id=&customer_id=&page=1&limit=20
Get sales with filters and pagination.

#### GET /sales/:id
Get single sale.

#### POST /sales
Create a new sale.
```json
{
  "product_id": 1,
  "customer_id": 1,
  "quantity": 2,
  "unit_price": 999.00,
  "discount": 0,
  "payment_method": "card",
  "sale_date": "2024-06-01"
}
```

#### PUT /sales/:id
Update a sale.

#### DELETE /sales/:id
Delete a sale.

### 6. Reports

#### GET /reports/monthly-revenue?year=2024
Get monthly revenue analysis.

#### GET /reports/product-analysis
Get product-wise sales analysis.

#### GET /reports/customer-analysis
Get customer-wise analysis.

#### GET /reports/sales-trends?months=6
Get sales trends.

#### GET /reports/revenue-growth
Get revenue growth (month-over-month).

#### GET /reports/download-monthly?year=2024&month=6
Download monthly report as Excel file.

#### POST /reports/import-excel
Import sales data from Excel file (multipart/form-data).

## Error Responses
```json
{
  "success": false,
  "message": "Error description"
}
```

## HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error