/**
 * RetailMax Pvt. Ltd. - Data Generator
 * Generates 10,000 realistic sales records for 2026
 * Run with: node database/generateData.js
 */

const fs = require('fs');
const path = require('path');

const TOTAL_SALES = 10000;
const YEAR = 2026;

const salesExecutives = [
    'Amit Kumar', 'Priya Sharma', 'Rahul Verma', 'Sneha Patel', 'Vikram Singh',
    'Ananya Gupta', 'Rohit Joshi', 'Neha Reddy', 'Arjun Nair', 'Kavita Desai'
];

const regions = {
    'North': [
        { city: 'Delhi', state: 'Delhi', weight: 15 },
        { city: 'Jaipur', state: 'Rajasthan', weight: 8 },
        { city: 'Lucknow', state: 'Uttar Pradesh', weight: 7 },
        { city: 'Chandigarh', state: 'Punjab', weight: 5 },
        { city: 'Dehradun', state: 'Uttarakhand', weight: 3 }
    ],
    'South': [
        { city: 'Bangalore', state: 'Karnataka', weight: 15 },
        { city: 'Chennai', state: 'Tamil Nadu', weight: 12 },
        { city: 'Hyderabad', state: 'Telangana', weight: 12 },
        { city: 'Kochi', state: 'Kerala', weight: 5 },
        { city: 'Visakhapatnam', state: 'Andhra Pradesh', weight: 4 }
    ],
    'East': [
        { city: 'Kolkata', state: 'West Bengal', weight: 10 },
        { city: 'Bhubaneswar', state: 'Odisha', weight: 5 },
        { city: 'Guwahati', state: 'Assam', weight: 3 },
        { city: 'Patna', state: 'Bihar', weight: 4 },
        { city: 'Ranchi', state: 'Jharkhand', weight: 2 }
    ],
    'West': [
        { city: 'Mumbai', state: 'Maharashtra', weight: 18 },
        { city: 'Pune', state: 'Maharashtra', weight: 10 },
        { city: 'Ahmedabad', state: 'Gujarat', weight: 8 },
        { city: 'Surat', state: 'Gujarat', weight: 5 },
        { city: 'Nagpur', state: 'Maharashtra', weight: 4 }
    ]
};

const categories = {
    'Electronics': [
        { name: 'iPhone 16 Pro Max', price: 129999, cost: 95000, weight: 5 },
        { name: 'Samsung Galaxy S25 Ultra', price: 119999, cost: 88000, weight: 4 },
        { name: 'MacBook Pro M4', price: 169999, cost: 120000, weight: 3 },
        { name: 'Dell XPS 16 Laptop', price: 89999, cost: 65000, weight: 3 },
        { name: 'Sony 65" OLED TV', price: 129999, cost: 90000, weight: 2 },
        { name: 'Samsung 55" QLED TV', price: 69999, cost: 50000, weight: 3 },
        { name: 'iPad Pro M4', price: 79999, cost: 55000, weight: 4 },
        { name: 'Apple Watch Ultra 3', price: 59999, cost: 40000, weight: 3 },
        { name: 'Samsung Galaxy Watch 7', price: 29999, cost: 20000, weight: 4 },
        { name: 'PlayStation 5 Pro', price: 54999, cost: 38000, weight: 5 }
    ],
    'Clothing': [
        { name: 'Premium Cotton Shirt', price: 2499, cost: 1200, weight: 12 },
        { name: 'Designer Jeans', price: 3999, cost: 1800, weight: 10 },
        { name: 'Winter Jacket', price: 5999, cost: 3000, weight: 6 },
        { name: 'Silk Saree', price: 8999, cost: 4000, weight: 5 },
        { name: 'Formal Suit', price: 12999, cost: 7000, weight: 3 },
        { name: 'Casual T-Shirt Pack', price: 1499, cost: 700, weight: 15 },
        { name: 'Ethnic Kurta Set', price: 2999, cost: 1400, weight: 8 },
        { name: 'Sports Track Suit', price: 3499, cost: 1700, weight: 5 }
    ],
    'Footwear': [
        { name: 'Nike Air Max 2026', price: 12999, cost: 7000, weight: 8 },
        { name: 'Adidas Ultraboost 26', price: 14999, cost: 8000, weight: 7 },
        { name: 'Puma Running Shoes', price: 5999, cost: 3000, weight: 10 },
        { name: 'Woodland Boots', price: 7999, cost: 4000, weight: 5 },
        { name: 'Bata Formal Shoes', price: 2999, cost: 1500, weight: 8 },
        { name: 'Crocs Clogs', price: 1999, cost: 900, weight: 6 },
        { name: 'Sparx Sneakers', price: 2499, cost: 1200, weight: 9 }
    ],
    'Home Appliances': [
        { name: 'Samsung Refrigerator 500L', price: 45999, cost: 32000, weight: 4 },
        { name: 'LG Washing Machine 8kg', price: 32999, cost: 22000, weight: 5 },
        { name: 'Panasonic Microwave', price: 12999, cost: 8000, weight: 6 },
        { name: 'Dyson V15 Vacuum', price: 59999, cost: 40000, weight: 3 },
        { name: 'Philips Air Purifier', price: 24999, cost: 15000, weight: 4 },
        { name: 'Blue Star AC 1.5 Ton', price: 39999, cost: 28000, weight: 5 },
        { name: 'Bajaj Mixer Grinder', price: 4999, cost: 2500, weight: 8 },
        { name: 'Prestige Induction Cooktop', price: 3999, cost: 2000, weight: 7 }
    ],
    'Accessories': [
        { name: 'Titan Smart Watch', price: 7999, cost: 4000, weight: 8 },
        { name: 'Fastrack Sunglasses', price: 2999, cost: 1200, weight: 10 },
        { name: 'Noise Cancelling Headphones', price: 12999, cost: 7000, weight: 6 },
        { name: 'Leather Wallet', price: 1999, cost: 800, weight: 12 },
        { name: 'Backpack 40L', price: 3499, cost: 1600, weight: 8 },
        { name: 'Fossil Analog Watch', price: 14999, cost: 8000, weight: 4 },
        { name: 'Ray-Ban Aviator', price: 12999, cost: 6500, weight: 5 }
    ],
    'Audio': [
        { name: 'Bose SoundLink Max', price: 29999, cost: 18000, weight: 5 },
        { name: 'JBL PartyBox 310', price: 24999, cost: 15000, weight: 4 },
        { name: 'Sony WH-1000XM6', price: 29999, cost: 18000, weight: 6 },
        { name: 'Marshall Stanmore III', price: 34999, cost: 22000, weight: 3 },
        { name: 'boAt Airdopes 800', price: 2999, cost: 1300, weight: 12 },
        { name: 'Noise Buds Pro', price: 3999, cost: 1800, weight: 10 },
        { name: 'Home Theater 5.1', price: 29999, cost: 18000, weight: 3 }
    ],
    'Grocery & Essentials': [
        { name: 'Premium Basmati Rice 5kg', price: 599, cost: 350, weight: 20 },
        { name: 'Fortune Cooking Oil 5L', price: 799, cost: 500, weight: 18 },
        { name: 'Tata Tea Premium 1kg', price: 499, cost: 280, weight: 15 },
        { name: 'Organic Honey 500g', price: 699, cost: 350, weight: 10 },
        { name: 'Dry Fruits Gift Box', price: 1499, cost: 800, weight: 12 },
        { name: 'Assorted Chocolates Pack', price: 999, cost: 500, weight: 14 },
        { name: 'Premium Coffee Beans 1kg', price: 1299, cost: 700, weight: 8 }
    ],
    'Beauty & Personal Care': [
        { name: 'Premium Perfume 100ml', price: 4999, cost: 2000, weight: 8 },
        { name: 'Hair Dryer Professional', price: 2999, cost: 1400, weight: 7 },
        { name: 'Face Cream Set', price: 1999, cost: 900, weight: 10 },
        { name: 'Electric Shaver', price: 3999, cost: 1800, weight: 6 },
        { name: 'Skincare Gift Set', price: 3999, cost: 1800, weight: 8 },
        { name: 'Makeup Kit Professional', price: 5999, cost: 2800, weight: 5 }
    ]
};

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedRandom(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    for (const item of items) {
        random -= item.weight;
        if (random <= 0) return item;
    }
    return items[items.length - 1];
}

const firstNames = [
    'Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Ananya', 'Rohit', 'Neha', 'Arjun', 'Kavita',
    'Rajesh', 'Pooja', 'Sanjay', 'Deepa', 'Manoj', 'Shweta', 'Suresh', 'Divya', 'Ravi', 'Meera',
    'Vijay', 'Nisha', 'Anil', 'Rekha', 'Sunil', 'Geeta', 'Ashok', 'Kiran', 'Dinesh', 'Swati',
    'Mahesh', 'Anita', 'Prakash', 'Sarita', 'Gaurav', 'Lata', 'Nitin', 'Preeti', 'Hemant', 'Ritu',
    'Karan', 'Isha', 'Deepak', 'Shalini', 'Alok', 'Bhavna', 'Tarun', 'Archana', 'Naveen', 'Pallavi'
];

const lastNames = [
    'Sharma', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Verma', 'Reddy', 'Joshi', 'Nair', 'Desai',
    'Mehta', 'Saxena', 'Tiwari', 'Rao', 'Jain', 'Shah', 'Agarwal', 'Mishra', 'Pandey', 'Chopra',
    'Malhotra', 'Kapoor', 'Bhat', 'Menon', 'Iyer', 'Das', 'Sen', 'Ghosh', 'Bose', 'Banerjee',
    'Choudhury', 'Sarkar', 'Mukherjee', 'Roy', 'Khan', 'Ansari', 'Sheikh', 'Pawar', 'Patil', 'Deshmukh'
];

function generateCustomerName() {
    return firstNames[rand(0, firstNames.length - 1)] + ' ' + lastNames[rand(0, lastNames.length - 1)];
}

function generateEmail(name) {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'retailmax.com', 'email.com'];
    return name.toLowerCase().replace(/\s+/g, '.') + rand(1, 999) + '@' + domains[rand(0, domains.length - 1)];
}

function generatePhone() {
    const prefixes = ['98', '97', '96', '95', '99', '88', '87', '86', '85', '70'];
    return prefixes[rand(0, prefixes.length - 1)] + String(rand(10000000, 99999999));
}

const monthlyWeights = {
    1: 1.0, 2: 0.95, 3: 1.05,
    4: 0.85, 5: 0.85, 6: 0.80,
    7: 0.70, 8: 0.65, 9: 0.75,
    10: 2.0, 11: 2.0,
    12: 1.6
};

const paymentMethods = [
    { method: 'upi', weight: 35 },
    { method: 'card', weight: 30 },
    { method: 'online', weight: 20 },
    { method: 'cash', weight: 15 }
];

const orderStatuses = [
    { status: 'delivered', weight: 85 },
    { status: 'shipped', weight: 5 },
    { status: 'processing', weight: 4 },
    { status: 'cancelled', weight: 4 },
    { status: 'pending', weight: 2 }
];

console.log('Generating RetailMax Pvt. Ltd. sales data for 2026...');
console.log('');

const customers = [];
const usedEmails = new Set();
for (let i = 0; i < 200; i++) {
    const name = generateCustomerName();
    let email = generateEmail(name);
    while (usedEmails.has(email)) {
        email = generateEmail(name);
    }
    usedEmails.add(email);
    const regionNames = Object.keys(regions);
    const regionName = regionNames[rand(0, regionNames.length - 1)];
    const cityData = regions[regionName][rand(0, regions[regionName].length - 1)];
    customers.push({
        id: i + 1,
        name: name,
        email: email,
        phone: generatePhone(),
        city: cityData.city,
        state: cityData.state,
        region: regionName
    });
}

const products = [];
let productId = 1;
for (const [category, items] of Object.entries(categories)) {
    for (const item of items) {
        products.push({
            id: productId++,
            name: item.name,
            category: category,
            price: item.price,
            cost: item.cost,
            stock: rand(50, 500),
            weight: item.weight
        });
    }
}

const sales = [];
const totalWeight = Object.values(monthlyWeights).reduce((a, b) => a + b, 0);
const salesPerMonth = {};
for (let m = 1; m <= 12; m++) {
    salesPerMonth[m] = Math.round((monthlyWeights[m] / totalWeight) * TOTAL_SALES);
}
const totalAllocated = Object.values(salesPerMonth).reduce((a, b) => a + b, 0);
salesPerMonth[12] += (TOTAL_SALES - totalAllocated);

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
console.log('Monthly Sales Distribution:');
for (let m = 1; m <= 12; m++) {
    console.log('  ' + monthNames[m - 1] + ': ' + salesPerMonth[m] + ' sales');
}
console.log('');

let saleId = 1;
for (let month = 1; month <= 12; month++) {
    const numSales = salesPerMonth[month];
    const daysInMonth = new Date(YEAR, month, 0).getDate();
    for (let i = 0; i < numSales; i++) {
        let day = rand(1, daysInMonth);
        if (Math.random() < 0.3) {
            const weekendDays = [5, 6, 0];
            day = weekendDays[rand(0, 2)];
            if (day < 1) day = 1;
            if (day > daysInMonth) day = daysInMonth;
        }
        const saleDate = YEAR + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        const customer = customers[rand(0, customers.length - 1)];
        const product = weightedRandom(products);
        let quantity;
        if (product.price < 1000) {
            quantity = rand(2, 10);
        } else if (product.price < 10000) {
            quantity = rand(1, 5);
        } else {
            quantity = rand(1, 3);
        }
        let discountPercent = 0;
        if (month === 10 || month === 11) {
            discountPercent = rand(5, 20);
        } else if (month === 12) {
            discountPercent = rand(5, 15);
        } else if (Math.random() < 0.15) {
            discountPercent = rand(5, 10);
        }
        const unitPrice = product.price;
        const subtotal = quantity * unitPrice;
        const discount = Math.round(subtotal * discountPercent / 100);
        const totalAmount = subtotal - discount;
        const executive = salesExecutives[rand(0, salesExecutives.length - 1)];
        const payment = weightedRandom(paymentMethods);
        const status = weightedRandom(orderStatuses);
        sales.push({
            id: saleId++,
            product_id: product.id,
            customer_id: customer.id,
            user_id: 1,
            quantity: quantity,
            unit_price: unitPrice,
            total_amount: totalAmount,
            discount: discount,
            payment_method: payment.method,
            sale_date: saleDate,
            sales_executive: executive,
            region: customer.region,
            order_status: status.status
        });
    }
}

for (let i = sales.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = sales[i];
    sales[i] = sales[j];
    sales[j] = temp;
}
sales.forEach(function(s, index) { s.id = index + 1; });

console.log('Generated ' + sales.length + ' sales records');
console.log('Generated ' + customers.length + ' customers');
console.log('Generated ' + products.length + ' products');
console.log('');

var customerSQL = '-- ============================================\n';
customerSQL += '-- RetailMax Pvt. Ltd. - Customer Data (200 records)\n';
customerSQL += '-- Auto-generated on ' + new Date().toISOString() + '\n';
customerSQL += '-- ============================================\n\n';
customerSQL += 'USE salespulse;\n\nTRUNCATE TABLE customers;\n\n';
customerSQL += 'INSERT INTO customers (id, name, email, phone, city, state, region) VALUES\n';
var customerValues = customers.map(function(c) {
    return '(' + c.id + ", '" + c.name.replace(/'/g, "\\'") + "', '" + c.email + "', '" + c.phone + "', '" + c.city + "', '" + c.state + "', '" + c.region + "')";
});
customerSQL += customerValues.join(',\n') + ';\n';
fs.writeFileSync(path.join(__dirname, 'retailmax_customers.sql'), customerSQL);
console.log('Generated retailmax_customers.sql');

var productSQL = '-- ============================================\n';
productSQL += '-- RetailMax Pvt. Ltd. - Product Data (' + products.length + ' records)\n';
productSQL += '-- Auto-generated on ' + new Date().toISOString() + '\n';
productSQL += '-- ============================================\n\n';
productSQL += 'USE salespulse;\n\nTRUNCATE TABLE products;\n\n';
productSQL += 'INSERT INTO products (id, name, category, price, cost, stock, description) VALUES\n';
var productValues = products.map(function(p) {
    return '(' + p.id + ", '" + p.name.replace(/'/g, "\\'") + "', '" + p.category + "', " + p.price + ", " + p.cost + ", " + p.stock + ", '" + p.category + " product from RetailMax')";
});
productSQL += productValues.join(',\n') + ';\n';
fs.writeFileSync(path.join(__dirname, 'retailmax_products.sql'), productSQL);
console.log('Generated retailmax_products.sql');

var salesHeader = '-- ============================================\n';
salesHeader += '-- RetailMax Pvt. Ltd. - Sales Data (' + sales.length + ' records)\n';
salesHeader += '-- Auto-generated on ' + new Date().toISOString() + '\n';
salesHeader += '-- ============================================\n\n';
salesHeader += 'USE salespulse;\n\nTRUNCATE TABLE sales;\n\n';
salesHeader += 'INSERT INTO sales (id, product_id, customer_id, user_id, quantity, unit_price, total_amount, discount, payment_method, sale_date, sales_executive, region, order_status) VALUES\n';

var batchSize = 500;
var batchCount = 0;
for (var i = 0; i < sales.length; i += batchSize) {
    var batch = sales.slice(i, i + batchSize);
    var salesValues = batch.map(function(s) {
        return '(' + s.id + ', ' + s.product_id + ', ' + s.customer_id + ', ' + s.user_id + ', ' + s.quantity + ', ' + s.unit_price + ', ' + s.total_amount + ', ' + s.discount + ", '" + s.payment_method + "', '" + s.sale_date + "', '" + s.sales_executive + "', '" + s.region + "', '" + s.order_status + "')";
    });
    var batchSQL = salesHeader + salesValues.join(',\n') + ';\n';
    var filename = 'retailmax_sales_batch_' + (++batchCount) + '.sql';
    fs.writeFileSync(path.join(__dirname, filename), batchSQL);
    console.log('Generated ' + filename + ' (' + batch.length + ' records)');
}

var totalRevenue = 0;
var totalDiscount = 0;
var totalQuantity = 0;
for (var i = 0; i < sales.length; i++) {
    totalRevenue += sales[i].total_amount;
    totalDiscount += sales[i].discount;
    totalQuantity += sales[i].quantity;
}

var summarySQL = '-- ============================================\n';
summarySQL += '-- RetailMax Pvt. Ltd. - Data Summary\n';
summarySQL += '-- Auto-generated on ' + new Date().toISOString() + '\n';
summarySQL += '-- ============================================\n\n';
summarySQL += '-- Total Sales Records: ' + sales.length + '\n';
summarySQL += '-- Total Customers: ' + customers.length + '\n';
summarySQL += '-- Total Products: ' + products.length + '\n';
summarySQL += '-- Total Revenue: Rs.' + totalRevenue.toLocaleString('en-IN') + '\n';
summarySQL += '-- Total Discount: Rs.' + totalDiscount.toLocaleString('en-IN') + '\n';
summarySQL += '-- Total Items Sold: ' + totalQuantity.toLocaleString('en-IN') + '\n';
summarySQL += '-- Avg Order Value: Rs.' + Math.round(totalRevenue / sales.length).toLocaleString('en-IN') + '\n\n';
summarySQL += '-- Monthly Revenue Breakdown:\n';
for (var m = 1; m <= 12; m++) {
    var ms = sales.filter(function(s) { return s.sale_date.startsWith(String(YEAR) + '-' + String(m).padStart(2, '0')); });
    var rev = 0;
    for (var j = 0; j < ms.length; j++) rev += ms[j].total_amount;
    summarySQL += '-- ' + monthNames[m - 1] + ' ' + YEAR + ': Rs.' + rev.toLocaleString('en-IN') + ' (' + ms.length + ' orders)\n';
}
summarySQL += '\n-- Region-wise Revenue:\n';
var regionNames = ['North', 'South', 'East', 'West'];
for (var r = 0; r < regionNames.length; r++) {
    var rs = sales.filter(function(s) { return s.region === regionNames[r]; });
    var rev = 0;
    for (var j = 0; j < rs.length; j++) rev += rs[j].total_amount;
    summarySQL += '-- ' + regionNames[r] + ': Rs.' + rev.toLocaleString('en-IN') + ' (' + rs.length + ' orders)\n';
}
summarySQL += '\n-- Category-wise Revenue:\n';
var catNames = Object.keys(categories);
for (var c = 0; c < catNames.length; c++) {
    var catIds = products.filter(function(p) { return p.category === catNames[c]; }).map(function(p) { return p.id; });
    var cs = sales.filter(function(s) { return catIds.indexOf(s.product_id) !== -1; });
    var rev = 0;
    for (var j = 0; j < cs.length; j++) rev += cs[j].total_amount;
    summarySQL += '-- ' + catNames[c] + ': Rs.' + rev.toLocaleString('en-IN') + ' (' + cs.length + ' orders)\n';
}
fs.writeFileSync(path.join(__dirname, 'retailmax_summary.sql'), summarySQL);
console.log('Generated retailmax_summary.sql');

var report = '============================================\n';
report += '  RETAILMAX PVT. LTD. - 2026 SALES REPORT\n';
report += '============================================\n\n';
report += 'Total Orders:     ' + sales.length.toLocaleString('en-IN') + '\n';
report += 'Total Revenue:    Rs.' + totalRevenue.toLocaleString('en-IN') + '\n';
report += 'Total Items:      ' + totalQuantity.toLocaleString('en-IN') + '\n';
report += 'Total Discount:   Rs.' + totalDiscount.toLocaleString('en-IN') + '\n';
report += 'Avg Order Value:  Rs.' + Math.round(totalRevenue / sales.length).toLocaleString('en-IN') + '\n\n';
report += 'MONTHLY BREAKDOWN:\n';
for (var m = 0; m < 12; m++) {
    var ms = sales.filter(function(s) { return s.sale_date.startsWith(String(YEAR) + '-' + String(m + 1).padStart(2, '0')); });
    var rev = 0;
    for (var j = 0; j < ms.length; j++) rev += ms[j].total_amount;
    report += '  ' + monthNames[m] + ': Rs.' + rev.toLocaleString('en-IN') + ' (' + ms.length + ' orders)\n';
}
report += '\nREGION BREAKDOWN:\n';
for (var r = 0; r < regionNames.length; r++) {
    var rs = sales.filter(function(s) { return s.region === regionNames[r]; });
    var rev = 0;
    for (var j = 0; j < rs.length; j++) rev += rs[j].total_amount;
    report += '  ' + regionNames[r] + ': Rs.' + rev.toLocaleString('en-IN') + ' (' + rs.length + ' orders)\n';
}
report += '\nCATEGORY BREAKDOWN:\n';
for (var c = 0; c < catNames.length; c++) {
    var catIds = products.filter(function(p) { return p.category === catNames[c]; }).map(function(p) { return p.id; });
    var cs = sales.filter(function(s) { return catIds.indexOf(s.product_id) !== -1; });
    var rev = 0;
    for (var j = 0; j < cs.length; j++) rev += cs[j].total_amount;
    report += '  ' + catNames[c] + ': Rs.' + rev.toLocaleString('en-IN') + ' (' + cs.length + ' orders)\n';
}
report += '\nTOP 10 PRODUCTS:\n';
var sortedProducts = products.slice().sort(function(a, b) {
    var aSales = 0;
    var salesA = sales.filter(function(s) { return s.product_id === a.id; });
    for (var j = 0; j < salesA.length; j++) aSales += salesA[j].total_amount;
    var bSales = 0;
    var salesB = sales.filter(function(s) { return s.product_id === b.id; });
    for (var j = 0; j < salesB.length; j++) bSales += salesB[j].total_amount;
    return bSales - aSales;
});
for (var i = 0; i < 10; i++) {
    var p = sortedProducts[i];
    var rev = 0;
    var ps = sales.filter(function(s) { return s.product_id === p.id; });
    for (var j = 0; j < ps.length; j++) rev += ps[j].total_amount;
    report += '  ' + (i + 1) + '. ' + p.name + ' - Rs.' + rev.toLocaleString('en-IN') + '\n';
}
report += '\n============================================\n';
report += '  GENERATED ON: ' + new Date().toISOString() + '\n';
report += '============================================\n';

fs.writeFileSync(path.join(__dirname, 'retailmax_report_2026.txt'), report);
console.log('Generated retailmax_report_2026.txt');
console.log('');
console.log('Data generation complete!');
console.log('Check the database/ folder for all generated files.');