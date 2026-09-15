# SalesPulse - Sales Analytics & Management System

A comprehensive sales analytics and management system built with Node.js, Express.js, MySQL, and vanilla JavaScript. Designed for freshers applying to Mu Sigma's Technology/Data Engineering (TDE) role.

## 🚀 Features

### Authentication
- User Registration & Login
- JWT-based authentication
- Role-based access control

### Dashboard
- Real-time sales statistics (Revenue, Orders, Items, Customers)
- Monthly sales chart with revenue and order trends
- Top selling products and customers
- Recent sales activity feed

### Sales Management
- CRUD operations for sales transactions
- Advanced search and filtering (by date, product, customer)
- Pagination for large datasets
- Payment method tracking

### Product Management
- Complete product inventory management
- Category-based organization
- Stock tracking

### Customer Management
- Customer database with contact details
- Purchase history tracking

### Analytics & Reports
- Product-wise sales analysis with charts
- Customer-wise analysis with doughnut charts
- Sales trends visualization (last 6 months)
- Revenue growth month-over-month analysis
- Top selling products ranking
- Best performing customers

### Excel Import/Export
- Download monthly sales reports as Excel
- Import sales data from Excel files
- SheetJS (xlsx) integration

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5, CSS3, JavaScript | Frontend UI |
| Node.js, Express.js | Backend Server |
| MySQL | Database |
| Chart.js | Data Visualization |
| SheetJS (xlsx) | Excel Import/Export |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password Hashing |

## 📁 Project Structure

```
salespulse/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── customerController.js # Customer CRUD
│   │   ├── dashboardController.js# Dashboard data
│   │   ├── productController.js  # Product CRUD
│   │   ├── reportController.js   # Reports & Excel
│   │   └── saleController.js     # Sales CRUD
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── models/
│   │   ├── Customer.js          # Customer queries
│   │   ├── Product.js           # Product queries
│   │   ├── Sale.js              # Sale queries
│   │   └── User.js              # User queries
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── productRoutes.js
│   │   ├── reportRoutes.js
│   │   └── saleRoutes.js
│   ├── .env                     # Environment variables
│   └── server.js                # Entry point
├── frontend/
│   ├── css/
│   │   └── style.css            # Main stylesheet
│   ├── js/
│   │   ├── api.js               # API helper functions
│   │   └── app.js               # Main application logic
│   └── index.html               # Single page application
├── database/
│   ├── schema.sql               # Database schema
│   └── seed_data.sql            # Sample data
├── docs/
│   └── api_documentation.md     # API documentation
├── package.json
└── README.md
```

## 💾 Database Schema

### Tables

1. **users** - User authentication and roles
2. **customers** - Customer information
3. **products** - Product inventory
4. **sales** - Sales transactions

### Key SQL Queries Used

- `SELECT` with `JOIN` for relational data
- `INSERT` for creating records
- `UPDATE` for modifying records
- `DELETE` for removing records
- `WHERE` for filtering
- `GROUP BY` with `COUNT`, `SUM`, `AVG` for aggregation
- `ORDER BY` for sorting
- `LIMIT` for pagination
- `LAG()` for month-over-month growth calculation

## 🚀 Installation Guide

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm (Node Package Manager)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd salespulse
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup MySQL Database
1. Open MySQL command line or any MySQL client
2. Run the schema file:
```sql
source database/schema.sql
```
3. (Optional) Load sample data:
```sql
source database/seed_data.sql
```

### Step 4: Configure Environment Variables
Edit `backend/.env` and update:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=salespulse
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Step 5: Create a Default Admin User
After setting up the database, run this SQL to create an admin user:
```sql
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@salespulse.com', '$2a$10$NA0k.J/qhIW5K1JmxjJmvufvZcStmiKdPZZZI6hw.fo7Q8VKCBk4.', 'admin');
```

### Step 6: Start the Application
```bash
npm start
```
Or for development with auto-reload:
```bash
npm run dev
```

### Step 7: Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

### Default Login Credentials
- **Email:** admin@salespulse.com
- **Password:** admin123

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Get summary stats |
| GET | `/api/dashboard/monthly-sales` | Monthly sales chart data |
| GET | `/api/dashboard/top-products` | Top selling products |
| GET | `/api/dashboard/top-customers` | Top customers |
| GET | `/api/dashboard/recent-sales` | Recent sales |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | Get all customers |
| GET | `/api/customers/:id` | Get single customer |
| POST | `/api/customers` | Create customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |

### Sales
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales` | Get sales (with filters) |
| GET | `/api/sales/:id` | Get single sale |
| POST | `/api/sales` | Create sale |
| PUT | `/api/sales/:id` | Update sale |
| DELETE | `/api/sales/:id` | Delete sale |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/monthly-revenue` | Monthly revenue |
| GET | `/api/reports/product-analysis` | Product analysis |
| GET | `/api/reports/customer-analysis` | Customer analysis |
| GET | `/api/reports/sales-trends` | Sales trends |
| GET | `/api/reports/revenue-growth` | Revenue growth |
| GET | `/api/reports/download-monthly` | Download Excel report |
| POST | `/api/reports/import-excel` | Import Excel data |


### Author
Built with love.