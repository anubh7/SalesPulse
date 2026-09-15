/**
 * SalesPulse - Main Application
 * Handles routing, page rendering, and user interactions
 */

// ============================================
// APP STATE
// ============================================
const App = {
    currentPage: 'dashboard',
    charts: {},

    // Initialize the application
    init() {
        this.checkAuth();
        this.setupEventListeners();
    },

    // Check if user is authenticated
    checkAuth() {
        const token = API.getToken();
        const user = API.getUser();

        if (token && user) {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('appLayout').classList.add('active');
            document.getElementById('userName').textContent = user.name;
            document.getElementById('userRole').textContent = user.role;
            document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
            this.applyPermissions();
            this.navigate('dashboard');
        } else {
            document.getElementById('loginPage').style.display = 'flex';
            document.getElementById('appLayout').classList.remove('active');
        }
    },

    // Currently logged-in user's role
    getRole() {
        try {
            const user = API.getUser();
            return user ? user.role : null;
        } catch (error) {
            return null;
        }
    },

    // Can this user manage (create/edit/delete) products, customers, imports?
    isAdminOrManager() {
        const role = this.getRole();
        return role === 'admin' || role === 'manager';
    },

    // Hide admin/manager-only UI elements for users with insufficient privileges
    applyPermissions() {
        const manage = this.isAdminOrManager();
        document.querySelectorAll('[data-manage="true"]').forEach(el => {
            el.style.display = manage ? '' : 'none';
        });
    },

    // Setup all event listeners
    setupEventListeners() {
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'block';
            document.getElementById('authTitle').textContent = 'Create Account';
            document.getElementById('authSubtitle').textContent = 'Register for SalesPulse';
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('authTitle').textContent = 'Welcome Back';
            document.getElementById('authSubtitle').textContent = 'Sign in to your SalesPulse account';
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page) this.navigate(page);
            });
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            API.logout();
        });

        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
            document.getElementById('sidebarOverlay').classList.toggle('active');
        });

        document.getElementById('sidebarOverlay').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebarOverlay').classList.remove('active');
        });

        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            });
        });

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.classList.remove('active');
            });
        });
    },

    // ==========================================
    // NAVIGATION
    // ==========================================
    navigate(page) {
        this.currentPage = page;
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(page + 'Page');
        if (targetSection) targetSection.classList.add('active');

        const pageTitles = {
            dashboard: 'Dashboard',
            sales: 'Sales Management',
            products: 'Products',
            customers: 'Customers',
            analytics: 'Analytics & Reports',
            reports: 'Reports'
        };
        document.getElementById('headerTitle').textContent = pageTitles[page] || 'Dashboard';
        this.loadPageData(page);
    },

    loadPageData(page) {
        switch (page) {
            case 'dashboard': this.loadDashboard(); break;
            case 'sales': this.loadSales(); this.loadProductFilter(); this.loadCustomerFilter(); break;
            case 'products': this.loadProducts(); break;
            case 'customers': this.loadCustomers(); break;
            case 'analytics': this.loadAnalytics(); break;
            case 'reports': this.loadReports(); break;
        }
    },

    // ==========================================
    // AUTHENTICATION
    // ==========================================
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const btn = document.querySelector('#loginForm .btn');
        btn.disabled = true;
        btn.textContent = 'Signing in...';

        try {
            await API.login(email, password);
            this.checkAuth();
            this.showToast('Login successful! Welcome back.', 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Sign In';
        }
    },

    async handleRegister() {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const btn = document.querySelector('#registerForm .btn');
        btn.disabled = true;
        btn.textContent = 'Creating account...';

        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            btn.disabled = false;
            btn.textContent = 'Create Account';
            return;
        }

        try {
            await API.register(name, email, password);
            this.checkAuth();
            this.showToast('Account created successfully!', 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Create Account';
        }
    },

    // ==========================================
    // DASHBOARD
    // ==========================================
    async loadDashboard() {
        try {
            const summary = await API.getDashboardSummary();
            document.getElementById('totalRevenue').textContent = '₹' + this.formatNumber(summary.data.total_revenue);
            document.getElementById('totalOrders').textContent = this.formatNumber(summary.data.total_orders);
            document.getElementById('totalItems').textContent = this.formatNumber(summary.data.total_items);
            document.getElementById('totalCustomers').textContent = this.formatNumber(summary.data.total_customers);
        } catch (error) {
            this.showToast('Error loading summary: ' + error.message, 'error');
        }

        try {
            const monthlyData = await API.getMonthlySales();
            this.renderMonthlyChart(monthlyData.data);
        } catch (error) {
            this.showToast('Error loading monthly sales: ' + error.message, 'error');
        }

        try {
            const topProducts = await API.getTopProducts();
            this.renderTopProducts(topProducts.data);
        } catch (error) {
            this.showToast('Error loading top products: ' + error.message, 'error');
        }

        try {
            const topCustomers = await API.getTopCustomers();
            this.renderTopCustomers(topCustomers.data);
        } catch (error) {
            this.showToast('Error loading top customers: ' + error.message, 'error');
        }

        try {
            const recentSales = await API.getRecentSales();
            this.renderRecentSales(recentSales.data);
        } catch (error) {
            this.showToast('Error loading recent sales: ' + error.message, 'error');
        }
    },

    renderMonthlyChart(data) {
        const ctx = document.getElementById('monthlyChart').getContext('2d');
        if (this.charts.monthly) this.charts.monthly.destroy();

        this.charts.monthly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.month),
                datasets: [
                    {
                        label: 'Revenue (₹)',
                        data: data.map(d => d.revenue),
                        backgroundColor: 'rgba(79, 70, 229, 0.8)',
                        borderColor: 'rgba(79, 70, 229, 1)',
                        borderWidth: 1,
                        borderRadius: 4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Orders',
                        data: data.map(d => d.orders),
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1,
                        borderRadius: 4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { position: 'top', labels: { usePointStyle: true } } },
                scales: {
                    y: { beginAtZero: true, ticks: { callback: value => '₹' + value.toLocaleString() } },
                    y1: { beginAtZero: true, position: 'right', grid: { display: false }, ticks: { callback: value => value.toLocaleString() } }
                }
            }
        });
    },

    renderTopProducts(products) {
        const container = document.getElementById('topProducts');
        if (!products || products.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No products data available</p></div>';
            return;
        }
        let html = '<div class="table-container"><table><thead><tr><th>Product</th><th>Category</th><th>Sales</th><th>Revenue</th></tr></thead><tbody>';
        products.forEach(p => {
            html += '<tr><td><strong>' + p.name + '</strong></td><td><span class="badge badge-info">' + (p.category || 'N/A') + '</span></td><td>' + p.total_sales + '</td><td><strong>₹' + this.formatNumber(p.total_revenue) + '</strong></td></tr>';
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;
    },

    renderTopCustomers(customers) {
        const container = document.getElementById('topCustomers');
        if (!customers || customers.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No customer data available</p></div>';
            return;
        }
        let html = '<div class="table-container"><table><thead><tr><th>Customer</th><th>City</th><th>Orders</th><th>Total Spent</th></tr></thead><tbody>';
        customers.forEach(c => {
            html += '<tr><td><strong>' + c.name + '</strong></td><td>' + (c.city || 'N/A') + '</td><td>' + c.total_orders + '</td><td><strong>₹' + this.formatNumber(c.total_spent) + '</strong></td></tr>';
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;
    },

    renderRecentSales(sales) {
        const container = document.getElementById('recentSales');
        if (!sales || sales.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No recent sales</p></div>';
            return;
        }
        let html = '<div class="table-container"><table><thead><tr><th>Product</th><th>Customer</th><th>Amount</th><th>Date</th><th>Payment</th></tr></thead><tbody>';
        sales.forEach(s => {
            const paymentBadge = { 'cash': 'badge-success', 'card': 'badge-info', 'online': 'badge-primary' }[s.payment_method] || 'badge-secondary';
            html += '<tr><td>' + s.product_name + '</td><td>' + s.customer_name + '</td><td><strong>₹' + this.formatNumber(s.total_amount) + '</strong></td><td>' + this.formatDate(s.sale_date) + '</td><td><span class="badge ' + paymentBadge + '">' + s.payment_method + '</span></td></tr>';
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;
    },

    // ==========================================
    // SALES MANAGEMENT
    // ==========================================
    async loadSales(filters) {
        filters = filters || {};
        const container = document.getElementById('salesTableBody');
        container.innerHTML = '<tr><td colspan="10" class="loading">Loading sales data</td></tr>';

        try {
            const result = await API.getSales(filters);
            const sales = result.sales || [];
            const total = result.total || 0;
            const page = result.page || 1;
            const totalPages = result.totalPages || 1;

            if (sales.length === 0) {
                container.innerHTML = '<tr><td colspan="10"><div class="empty-state"><div class="empty-icon">📦</div><h3>No Sales Found</h3><p>Start by adding your first sale</p></div></td></tr>';
                document.getElementById('salesPagination').innerHTML = '';
                return;
            }

            let html = '';
            const manage = this.isAdminOrManager();
            sales.forEach(s => {
                const statusBadge = { 'delivered': 'badge-success', 'shipped': 'badge-info', 'processing': 'badge-warning', 'pending': 'badge-primary', 'cancelled': 'badge-danger' }[s.order_status] || 'badge-secondary';
                html += '<tr><td>#' + s.id + '</td><td><strong>' + s.product_name + '</strong></td><td>' + s.customer_name + '</td><td>' + s.quantity + '</td><td>₹' + this.formatNumber(s.total_amount) + '</td><td>' + this.formatDate(s.sale_date) + '</td><td>' + (s.sales_executive || 'N/A') + '</td><td><span class="badge badge-info">' + (s.region || 'N/A') + '</span></td><td><span class="badge ' + statusBadge + '">' + s.order_status + '</span></td><td>' + (manage ? '<div class="table-actions"><button class="btn btn-sm btn-secondary" onclick="App.editSale(' + s.id + ')">✏️</button><button class="btn btn-sm btn-danger" onclick="App.deleteSale(' + s.id + ')">🗑️</button></div>' : '<span class="text-muted" style="font-size:12px;">View only</span>') + '</td></tr>';
            });
            container.innerHTML = html;
            this.renderSalesPagination(page, totalPages, total, filters);
        } catch (error) {
            container.innerHTML = '<tr><td colspan="10"><div class="empty-state"><h3>Error loading sales</h3><p>' + error.message + '</p></div></td></tr>';
        }
    },

    renderSalesPagination(currentPage, totalPages, total, filters) {
        const container = document.getElementById('salesPagination');
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        const params = new URLSearchParams();
        Object.keys(filters || {}).forEach(key => {
            if (filters[key] && key !== 'page') params.append(key, filters[key]);
        });
        const qs = params.toString() ? '?' + params.toString() : '';

        let html = '<span class="pagination-info">Page ' + currentPage + ' of ' + totalPages + ' (' + total + ' records)</span>';
        html += '<button ' + (currentPage <= 1 ? 'disabled' : '') + ' onclick="App.navigateToSalesPage(' + (currentPage - 1) + ', \'' + qs + '\')">‹ Prev</button>';

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += '<button class="' + (i === currentPage ? 'active' : '') + '" onclick="App.navigateToSalesPage(' + i + ', \'' + qs + '\')">' + i + '</button>';
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += '<button disabled>...</button>';
            }
        }
        html += '<button ' + (currentPage >= totalPages ? 'disabled' : '') + ' onclick="App.navigateToSalesPage(' + (currentPage + 1) + ', \'' + qs + '\')">Next ›</button>';
        container.innerHTML = html;
    },

    navigateToSalesPage(page, queryString) {
        const params = new URLSearchParams(queryString || '');
        const filters = {
            search: (document.getElementById('salesSearch').value || params.get('search') || ''),
            start_date: (document.getElementById('salesStartDate').value || params.get('start_date') || ''),
            end_date: (document.getElementById('salesEndDate').value || params.get('end_date') || ''),
            product_id: (document.getElementById('salesProductFilter').value || params.get('product_id') || ''),
            customer_id: (document.getElementById('salesCustomerFilter').value || params.get('customer_id') || ''),
            region: (document.getElementById('salesRegionFilter').value || params.get('region') || ''),
            order_status: (document.getElementById('salesStatusFilter').value || params.get('order_status') || ''),
            page: page
        };
        this.loadSales(filters);
    },

    applySalesFilters() {
        this.navigateToSalesPage(1);
    },

    async loadProductFilter() {
        try {
            const result = await API.getProducts();
            const select = document.getElementById('salesProductFilter');
            select.innerHTML = '<option value="">All Products</option>';
            result.products.forEach(p => {
                select.innerHTML += '<option value="' + p.id + '">' + p.name + '</option>';
            });
        } catch (error) {
            console.error('Error loading products filter:', error);
        }
    },

    async loadCustomerFilter() {
        try {
            const result = await API.getCustomers();
            const select = document.getElementById('salesCustomerFilter');
            select.innerHTML = '<option value="">All Customers</option>';
            result.customers.forEach(c => {
                select.innerHTML += '<option value="' + c.id + '">' + c.name + '</option>';
            });
        } catch (error) {
            console.error('Error loading customers filter:', error);
        }
    },

    showAddSaleModal() {
        this.resetModalForm('saleForm');
        document.getElementById('saleModalTitle').textContent = 'Add New Sale';
        document.getElementById('saleForm').dataset.id = '';
        document.getElementById('saleModal').classList.add('active');
        this.loadSaleFormOptions();
    },

    async editSale(id) {
        try {
            const result = await API.getSale(id);
            const sale = result.sale;
            document.getElementById('saleModalTitle').textContent = 'Edit Sale #' + id;
            document.getElementById('saleForm').dataset.id = id;
            document.getElementById('saleProduct').value = sale.product_id;
            document.getElementById('saleCustomer').value = sale.customer_id;
            document.getElementById('saleQuantity').value = sale.quantity;
            document.getElementById('saleUnitPrice').value = sale.unit_price;
            document.getElementById('saleDiscount').value = sale.discount;
            document.getElementById('salePayment').value = sale.payment_method;
            document.getElementById('saleDate').value = sale.sale_date;
            document.getElementById('saleExecutive').value = sale.sales_executive || '';
            document.getElementById('saleRegion').value = sale.region || '';
            document.getElementById('saleOrderStatus').value = sale.order_status || 'delivered';
            document.getElementById('saleModal').classList.add('active');
            this.loadSaleFormOptions();
        } catch (error) {
            this.showToast('Error loading sale: ' + error.message, 'error');
        }
    },

    async loadSaleFormOptions() {
        try {
            const products = await API.getProducts();
            const customers = await API.getCustomers();
            const productSelect = document.getElementById('saleProduct');
            productSelect.innerHTML = '<option value="">Select Product</option>';
            products.products.forEach(p => {
                productSelect.innerHTML += '<option value="' + p.id + '">' + p.name + ' - ₹' + p.price + '</option>';
            });
            const customerSelect = document.getElementById('saleCustomer');
            customerSelect.innerHTML = '<option value="">Select Customer</option>';
            customers.customers.forEach(c => {
                customerSelect.innerHTML += '<option value="' + c.id + '">' + c.name + ' (' + c.email + ')</option>';
            });
        } catch (error) {
            console.error('Error loading form options:', error);
        }
    },

    async saveSale() {
        const form = document.getElementById('saleForm');
        const id = form.dataset.id;
        const data = {
            product_id: document.getElementById('saleProduct').value,
            customer_id: document.getElementById('saleCustomer').value,
            quantity: parseInt(document.getElementById('saleQuantity').value),
            unit_price: parseFloat(document.getElementById('saleUnitPrice').value),
            discount: parseFloat(document.getElementById('saleDiscount').value) || 0,
            payment_method: document.getElementById('salePayment').value,
            sale_date: document.getElementById('saleDate').value,
            sales_executive: document.getElementById('saleExecutive').value || null,
            region: document.getElementById('saleRegion').value || null,
            order_status: document.getElementById('saleOrderStatus').value || 'delivered'
        };

        if (!data.product_id || !data.customer_id || !data.quantity || !data.unit_price || !data.sale_date) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }

        const btn = document.querySelector('#saleForm .btn-primary');
        btn.disabled = true;
        btn.textContent = id ? 'Updating...' : 'Saving...';

        try {
            if (id) {
                await API.updateSale(id, data);
                this.showToast('Sale updated successfully!', 'success');
            } else {
                await API.createSale(data);
                this.showToast('Sale created successfully!', 'success');
            }
            document.getElementById('saleModal').classList.remove('active');
            this.loadSales();
        } catch (error) {
            this.showToast('Error: ' + error.message, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = id ? 'Update Sale' : 'Add Sale';
        }
    },

    async deleteSale(id) {
        if (!confirm('Are you sure you want to delete this sale?')) return;
        try {
            await API.deleteSale(id);
            this.showToast('Sale deleted successfully!', 'success');
            this.loadSales();
        } catch (error) {
            this.showToast('Error deleting sale: ' + error.message, 'error');
        }
    },

    // ==========================================
    // PRODUCTS
    // ==========================================
    async loadProducts(search) {
        search = search || '';
        const container = document.getElementById('productsTableBody');
        container.innerHTML = '<tr><td colspan="6" class="loading">Loading products</td></tr>';

        try {
            const result = await API.getProducts(search);
            if (!result.products || result.products.length === 0) {
                container.innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">📦</div><h3>No Products Found</h3><p>Add your first product to get started</p></div></td></tr>';
                return;
            }

            let html = '';
            const manage = this.isAdminOrManager();
            result.products.forEach(p => {
                html += '<tr><td><strong>' + p.name + '</strong></td><td><span class="badge badge-info">' + (p.category || 'N/A') + '</span></td><td>₹' + this.formatNumber(p.price) + '</td><td>₹' + this.formatNumber(p.cost) + '</td><td>' + p.stock + '</td><td>' + (manage ? '<div class="table-actions"><button class="btn btn-sm btn-secondary" onclick="App.editProduct(' + p.id + ')">✏️</button><button class="btn btn-sm btn-danger" onclick="App.deleteProduct(' + p.id + ')">🗑️</button></div>' : '<span class="text-muted" style="font-size:12px;">View only</span>') + '</td></tr>';
            });
            container.innerHTML = html;
        } catch (error) {
            container.innerHTML = '<tr><td colspan="6"><div class="empty-state"><h3>Error loading products</h3><p>' + error.message + '</p></div></td></tr>';
        }
    },

    searchProducts() {
        const search = document.getElementById('productSearch').value;
        this.loadProducts(search);
    },

    showAddProductModal() {
        this.resetModalForm('productForm');
        document.getElementById('productModalTitle').textContent = 'Add New Product';
        document.getElementById('productForm').dataset.id = '';
        document.getElementById('productModal').classList.add('active');
    },

    async editProduct(id) {
        try {
            const result = await API.getProduct(id);
            const p = result.product;
            document.getElementById('productModalTitle').textContent = 'Edit Product';
            document.getElementById('productForm').dataset.id = id;
            document.getElementById('productName').value = p.name;
            document.getElementById('productCategory').value = p.category || '';
            document.getElementById('productPrice').value = p.price;
            document.getElementById('productCost').value = p.cost;
            document.getElementById('productStock').value = p.stock;
            document.getElementById('productDescription').value = p.description || '';
            document.getElementById('productModal').classList.add('active');
        } catch (error) {
            this.showToast('Error loading product: ' + error.message, 'error');
        }
    },

    async saveProduct() {
        const form = document.getElementById('productForm');
        const id = form.dataset.id;
        const data = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            cost: parseFloat(document.getElementById('productCost').value) || 0,
            stock: parseInt(document.getElementById('productStock').value) || 0,
            description: document.getElementById('productDescription').value
        };

        if (!data.name || !data.price) {
            this.showToast('Product name and price are required', 'error');
            return;
        }

        const btn = document.querySelector('#productForm .btn-primary');
        btn.disabled = true;
        btn.textContent = id ? 'Updating...' : 'Saving...';

        try {
            if (id) {
                await API.updateProduct(id, data);
                this.showToast('Product updated successfully!', 'success');
            } else {
                await API.createProduct(data);
                this.showToast('Product created successfully!', 'success');
            }
            document.getElementById('productModal').classList.remove('active');
            this.loadProducts();
        } catch (error) {
            this.showToast('Error: ' + error.message, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = id ? 'Update Product' : 'Add Product';
        }
    },

    async deleteProduct(id) {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await API.deleteProduct(id);
            this.showToast('Product deleted successfully!', 'success');
            this.loadProducts();
        } catch (error) {
            this.showToast('Error deleting product: ' + error.message, 'error');
        }
    },

    // ==========================================
    // CUSTOMERS
    // ==========================================
    async loadCustomers(search) {
        search = search || '';
        const container = document.getElementById('customersTableBody');
        container.innerHTML = '<tr><td colspan="5" class="loading">Loading customers</td></tr>';

        try {
            const result = await API.getCustomers(search);
            if (!result.customers || result.customers.length === 0) {
                container.innerHTML = '<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">👥</div><h3>No Customers Found</h3><p>Add your first customer</p></div></td></tr>';
                return;
            }

            let html = '';
            const manage = this.isAdminOrManager();
            result.customers.forEach(c => {
                html += '<tr><td><strong>' + c.name + '</strong></td><td>' + (c.email || 'N/A') + '</td><td>' + (c.phone || 'N/A') + '</td><td>' + (c.city || 'N/A') + '</td><td>' + (manage ? '<div class="table-actions"><button class="btn btn-sm btn-secondary" onclick="App.editCustomer(' + c.id + ')">✏️</button><button class="btn btn-sm btn-danger" onclick="App.deleteCustomer(' + c.id + ')">🗑️</button></div>' : '<span class="text-muted" style="font-size:12px;">View only</span>') + '</td></tr>';
            });
            container.innerHTML = html;
        } catch (error) {
            container.innerHTML = '<tr><td colspan="5"><div class="empty-state"><h3>Error loading customers</h3><p>' + error.message + '</p></div></td></tr>';
        }
    },

    searchCustomers() {
        const search = document.getElementById('customerSearch').value;
        this.loadCustomers(search);
    },

    showAddCustomerModal() {
        this.resetModalForm('customerForm');
        document.getElementById('customerModalTitle').textContent = 'Add New Customer';
        document.getElementById('customerForm').dataset.id = '';
        document.getElementById('customerModal').classList.add('active');
    },

    async editCustomer(id) {
        try {
            const result = await API.getCustomer(id);
            const c = result.customer;
            document.getElementById('customerModalTitle').textContent = 'Edit Customer';
            document.getElementById('customerForm').dataset.id = id;
            document.getElementById('customerName').value = c.name;
            document.getElementById('customerEmail').value = c.email || '';
            document.getElementById('customerPhone').value = c.phone || '';
            document.getElementById('customerCity').value = c.city || '';
            document.getElementById('customerState').value = c.state || '';
            document.getElementById('customerModal').classList.add('active');
        } catch (error) {
            this.showToast('Error loading customer: ' + error.message, 'error');
        }
    },

    async saveCustomer() {
        const form = document.getElementById('customerForm');
        const id = form.dataset.id;
        const data = {
            name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            city: document.getElementById('customerCity').value,
            state: document.getElementById('customerState').value
        };

        if (!data.name) {
            this.showToast('Customer name is required', 'error');
            return;
        }

        const btn = document.querySelector('#customerForm .btn-primary');
        btn.disabled = true;
        btn.textContent = id ? 'Updating...' : 'Saving...';

        try {
            if (id) {
                await API.updateCustomer(id, data);
                this.showToast('Customer updated successfully!', 'success');
            } else {
                await API.createCustomer(data);
                this.showToast('Customer created successfully!', 'success');
            }
            document.getElementById('customerModal').classList.remove('active');
            this.loadCustomers();
        } catch (error) {
            this.showToast('Error: ' + error.message, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = id ? 'Update Customer' : 'Add Customer';
        }
    },

    async deleteCustomer(id) {
        if (!confirm('Are you sure you want to delete this customer?')) return;
        try {
            await API.deleteCustomer(id);
            this.showToast('Customer deleted successfully!', 'success');
            this.loadCustomers();
        } catch (error) {
            this.showToast('Error deleting customer: ' + error.message, 'error');
        }
    },

    // ==========================================
    // ANALYTICS
    // ==========================================
    async loadAnalytics() {
        try {
            const productAnalysis = await API.getProductAnalysis();
            this.renderProductAnalysisChart(productAnalysis.data);
            this.renderProductAnalysisTable(productAnalysis.data);
        } catch (error) {
            this.showToast('Error loading product analysis: ' + error.message, 'error');
        }

        try {
            const customerAnalysis = await API.getCustomerAnalysis();
            this.renderCustomerAnalysisChart(customerAnalysis.data);
            this.renderCustomerAnalysisTable(customerAnalysis.data);
        } catch (error) {
            this.showToast('Error loading customer analysis: ' + error.message, 'error');
        }

        try {
            const trends = await API.getSalesTrends();
            this.renderSalesTrendsChart(trends.data);
        } catch (error) {
            this.showToast('Error loading sales trends: ' + error.message, 'error');
        }

        try {
            const growth = await API.getRevenueGrowth();
            this.renderRevenueGrowthChart(growth.data);
        } catch (error) {
            this.showToast('Error loading revenue growth: ' + error.message, 'error');
        }

        try {
            const topProducts = await API.getReportTopProducts();
            this.renderAnalyticsTopProducts(topProducts.data);
        } catch (error) {
            this.showToast('Error loading top products: ' + error.message, 'error');
        }

        try {
            const bestCustomers = await API.getBestCustomers();
            this.renderAnalyticsBestCustomers(bestCustomers.data);
        } catch (error) {
            this.showToast('Error loading best customers: ' + error.message, 'error');
        }
    },

    renderProductAnalysisChart(data) {
        const ctx = document.getElementById('productAnalysisChart').getContext('2d');
        if (this.charts.productAnalysis) this.charts.productAnalysis.destroy();

        this.charts.productAnalysis = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.name),
                datasets: [
                    { label: 'Revenue (₹)', data: data.map(d => d.total_revenue), backgroundColor: 'rgba(79, 70, 229, 0.8)', borderRadius: 4 },
                    { label: 'Quantity Sold', data: data.map(d => d.total_quantity), backgroundColor: 'rgba(16, 185, 129, 0.8)', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { usePointStyle: true } }, title: { display: true, text: 'Product-wise Sales Analysis', font: { size: 16 } } },
                scales: { y: { beginAtZero: true, ticks: { callback: v => '₹' + v.toLocaleString() } } }
            }
        });
    },

    renderProductAnalysisTable(data) {
        const container = document.getElementById('productAnalysisTable');
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No data available</p></div>';
            return;
        }
        let html = '<div class="table-container"><table><thead><tr><th>Product</th><th>Category</th><th>Orders</th><th>Quantity</th><th>Revenue</th></tr></thead><tbody>';
        data.forEach(d => {
            html += '<tr><td><strong>' + d.name + '</strong></td><td><span class="badge badge-info">' + (d.category || 'N/A') + '</span></td><td>' + d.total_orders + '</td><td>' + d.total_quantity + '</td><td><strong>₹' + this.formatNumber(d.total_revenue) + '</strong></td></tr>';
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;
    },

    renderCustomerAnalysisChart(data) {
        const ctx = document.getElementById('customerAnalysisChart').getContext('2d');
        if (this.charts.customerAnalysis) this.charts.customerAnalysis.destroy();

        const top10 = data.slice(0, 10);
        this.charts.customerAnalysis = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: top10.map(d => d.name),
                datasets: [{ data: top10.map(d => d.total_spent), backgroundColor: ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'] }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right', labels: { boxWidth: 12 } }, title: { display: true, text: 'Top Customers by Revenue', font: { size: 16 } } }
            }
        });
    },

    renderCustomerAnalysisTable(data) {
        const container = document.getElementById('customerAnalysisTable');
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No data available</p></div>';
            return;
        }
        let html = '<div class="table-container"><table><thead><tr><th>Customer</th><th>City</th><th>Orders</th><th>Items</th><th>Total Spent</th></tr></thead><tbody>';
        data.forEach(d => {
            html += '<tr><td><strong>' + d.name + '</strong></td><td>' + (d.city || 'N/A') + '</td><td>' + d.total_orders + '</td><td>' + d.total_items + '</td><td><strong>₹' + this.formatNumber(d.total_spent) + '</strong></td></tr>';
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;
    },

    renderSalesTrendsChart(data) {
        const ctx = document.getElementById('salesTrendsChart').getContext('2d');
        if (this.charts.salesTrends) this.charts.salesTrends.destroy();

        this.charts.salesTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.month),
                datasets: [
                    { label: 'Revenue (₹)', data: data.map(d => d.total_revenue), borderColor: '#4f46e5', backgroundColor: 'rgba(79, 70, 229, 0.1)', fill: true, tension: 0.4 },
                    { label: 'Orders', data: data.map(d => d.total_orders), borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4, yAxisID: 'y1' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { position: 'top', labels: { usePointStyle: true } }, title: { display: true, text: 'Sales Trends (Last 6 Months)', font: { size: 16 } } },
                scales: { y: { beginAtZero: true, ticks: { callback: v => '₹' + v.toLocaleString() } }, y1: { beginAtZero: true, position: 'right', grid: { display: false } } }
            }
        });
    },

    renderRevenueGrowthChart(data) {
        const ctx = document.getElementById('revenueGrowthChart').getContext('2d');
        if (this.charts.revenueGrowth) this.charts.revenueGrowth.destroy();

        this.charts.revenueGrowth = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.month),
                datasets: [
                    { label: 'Revenue (₹)', data: data.map(d => d.revenue), backgroundColor: 'rgba(79, 70, 229, 0.8)', borderRadius: 4, order: 2 },
                    { label: 'Growth (%)', data: data.map(d => d.growth_percent || 0), type: 'line', borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4, pointRadius: 6, pointBackgroundColor: '#10b981', order: 1, yAxisID: 'y1' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { position: 'top', labels: { usePointStyle: true } }, title: { display: true, text: 'Revenue Growth (Month-over-Month)', font: { size: 16 } } },
                scales: { y: { beginAtZero: true, ticks: { callback: v => '₹' + v.toLocaleString() } }, y1: { beginAtZero: true, position: 'right', grid: { display: false }, ticks: { callback: v => v + '%' } } }
            }
        });
    },

    renderAnalyticsTopProducts(data) {
        const container = document.getElementById('analyticsTopProducts');
        if (!data || data.length === 0) { container.innerHTML = '<div class="empty-state"><p>No data</p></div>'; return; }
        let html = '<div class="table-container"><table><thead><tr><th>Product</th><th>Sales</th><th>Revenue</th></tr></thead><tbody>';
        data.forEach((d, i) => {
            html += '<tr><td>' + (i + 1) + '. <strong>' + d.name + '</strong></td><td>' + d.total_sales + '</td><td><strong>₹' + this.formatNumber(d.total_revenue) + '</strong></td></tr>';
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;
    },

    renderAnalyticsBestCustomers(data) {
        const container = document.getElementById('analyticsBestCustomers');
        if (!data || data.length === 0) { container.innerHTML = '<div class="empty-state"><p>No data</p></div>'; return; }
        let html = '<div class="table-container"><table><thead><tr><th>Customer</th><th>Orders</th><th>Total Spent</th></tr></thead><tbody>';
        data.forEach((d, i) => {
            html += '<tr><td>' + (i + 1) + '. <strong>' + d.name + '</strong></td><td>' + d.total_orders + '</td><td><strong>₹' + this.formatNumber(d.total_spent) + '</strong></td></tr>';
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;
    },

    // ==========================================
    // REPORTS
    // ==========================================
    async loadReports() {
        const now = new Date();
        document.getElementById('reportMonth').value = now.getMonth() + 1;
        document.getElementById('reportYear').value = now.getFullYear();

        try {
            const revenue = await API.getMonthlyRevenue();
            this.renderMonthlyRevenueChart(revenue.data);
        } catch (error) {
            console.error('Error loading monthly revenue:', error);
        }
    },

    renderMonthlyRevenueChart(data) {
        const ctx = document.getElementById('monthlyRevenueChart').getContext('2d');
        if (this.charts.monthlyRevenue) this.charts.monthlyRevenue.destroy();

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartData = months.map((_, index) => {
            const d = data.find(item => item.month === index + 1);
            return d ? d : { month: index + 1, total_revenue: 0 };
        });

        this.charts.monthlyRevenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Monthly Revenue (₹)',
                    data: chartData.map(d => d.total_revenue),
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4f46e5',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, title: { display: true, text: 'Monthly Revenue Overview', font: { size: 16 } } },
                scales: { y: { beginAtZero: true, ticks: { callback: v => '₹' + v.toLocaleString() } } }
            }
        });
    },

    async downloadReport() {
        const year = document.getElementById('reportYear').value;
        const month = document.getElementById('reportMonth').value;
        const btn = document.getElementById('downloadReportBtn');
        btn.disabled = true;
        btn.textContent = 'Downloading...';

        try {
            await API.downloadMonthlyReport(year, month);
            this.showToast('Report downloaded successfully!', 'success');
        } catch (error) {
            this.showToast('Error downloading report: ' + error.message, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = '📥 Download Report';
        }
    },

    async importExcelFile() {
        const fileInput = document.getElementById('excelFile');
        const file = fileInput.files[0];
        if (!file) {
            this.showToast('Please select an Excel file', 'error');
            return;
        }

        const btn = document.getElementById('importExcelBtn');
        btn.disabled = true;
        btn.textContent = 'Importing...';

        try {
            const result = await API.importExcel(file);
            this.showToast(result.message, 'success');
            fileInput.value = '';
        } catch (error) {
            this.showToast('Error importing: ' + error.message, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = '📤 Import Excel';
        }
    },

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    formatNumber(num) {
        if (!num) return '0';
        return parseFloat(num).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 0 });
    },

    formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    },

    resetModalForm(formId) {
        const form = document.getElementById(formId);
        if (form) { form.reset(); form.dataset.id = ''; }
    },

    showToast(message, type) {
        type = type || 'info';
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});