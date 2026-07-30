/**
 * SalesPulse - API Helper
 * Handles all API calls to the backend
 */

const API = {
    // Base URL for API calls
    baseURL: '/api',

    // Get auth token from localStorage
    getToken() {
        return localStorage.getItem('token');
    },

    // Set auth token
    setToken(token) {
        localStorage.setItem('token', token);
    },

    // Remove auth token
    removeToken() {
        localStorage.removeItem('token');
    },

    // Get stored user data
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Set user data
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Remove user data
    removeUser() {
        localStorage.removeItem('user');
    },

    // Generic fetch wrapper with auth headers
    async request(endpoint, options = {}) {
        const url = this.baseURL + endpoint;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add auth token if available
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            // If unauthorized, redirect to login
            if (error.message.includes('token') || error.message.includes('expired')) {
                this.logout();
            }
            throw error;
        }
    },

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    // POST request
    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    // PUT request
    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    // Upload file (for Excel import)
    async upload(endpoint, formData) {
        const url = this.baseURL + endpoint;
        const token = this.getToken();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Download file (for Excel export)
    async download(endpoint) {
        const url = this.baseURL + endpoint;
        const token = this.getToken();

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Download failed');
            }

            return await response.blob();
        } catch (error) {
            throw error;
        }
    },

    // ========== Auth APIs ==========
    async login(email, password) {
        const data = await this.post('/auth/login', { email, password });
        this.setToken(data.token);
        this.setUser(data.user);
        return data;
    },

    async register(name, email, password) {
        const data = await this.post('/auth/register', { name, email, password });
        this.setToken(data.token);
        this.setUser(data.user);
        return data;
    },

    logout() {
        this.removeToken();
        this.removeUser();
        window.location.href = '/';
    },

    // ========== Dashboard APIs ==========
    async getDashboardSummary() {
        return this.get('/dashboard/summary');
    },

    async getMonthlySales(year) {
        const query = year ? '?year=' + year : '';
        return this.get('/dashboard/monthly-sales' + query);
    },

    async getTopProducts(limit = 5) {
        return this.get('/dashboard/top-products?limit=' + limit);
    },

    async getTopCustomers(limit = 5) {
        return this.get('/dashboard/top-customers?limit=' + limit);
    },

    async getRecentSales(limit = 5) {
        return this.get('/dashboard/recent-sales?limit=' + limit);
    },

    // ========== Product APIs ==========
    async getProducts(search = '') {
        const query = search ? '?search=' + encodeURIComponent(search) : '';
        return this.get('/products' + query);
    },

    async getProduct(id) {
        return this.get('/products/' + id);
    },

    async createProduct(data) {
        return this.post('/products', data);
    },

    async updateProduct(id, data) {
        return this.put('/products/' + id, data);
    },

    async deleteProduct(id) {
        return this.delete('/products/' + id);
    },

    async getProductCategories() {
        return this.get('/products/categories');
    },

    // ========== Customer APIs ==========
    async getCustomers(search = '') {
        const query = search ? '?search=' + encodeURIComponent(search) : '';
        return this.get('/customers' + query);
    },

    async getCustomer(id) {
        return this.get('/customers/' + id);
    },

    async createCustomer(data) {
        return this.post('/customers', data);
    },

    async updateCustomer(id, data) {
        return this.put('/customers/' + id, data);
    },

    async deleteCustomer(id) {
        return this.delete('/customers/' + id);
    },

    // ========== Sale APIs ==========
    async getSales(filters = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filters.product_id) params.append('product_id', filters.product_id);
        if (filters.customer_id) params.append('customer_id', filters.customer_id);
        if (filters.region) params.append('region', filters.region);
        if (filters.order_status) params.append('order_status', filters.order_status);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        const query = params.toString() ? '?' + params.toString() : '';
        return this.get('/sales' + query);
    },

    async getSale(id) {
        return this.get('/sales/' + id);
    },

    async createSale(data) {
        return this.post('/sales', data);
    },

    async updateSale(id, data) {
        return this.put('/sales/' + id, data);
    },

    async deleteSale(id) {
        return this.delete('/sales/' + id);
    },

    // ========== Report APIs ==========
    async getMonthlyRevenue(year) {
        const query = year ? '?year=' + year : '';
        return this.get('/reports/monthly-revenue' + query);
    },

    async getProductAnalysis() {
        return this.get('/reports/product-analysis');
    },

    async getCustomerAnalysis() {
        return this.get('/reports/customer-analysis');
    },

    async getSalesTrends(months = 6) {
        return this.get('/reports/sales-trends?months=' + months);
    },

    async getRevenueGrowth() {
        return this.get('/reports/revenue-growth');
    },

    async getReportTopProducts(limit = 10) {
        return this.get('/reports/top-products?limit=' + limit);
    },

    async getBestCustomers(limit = 10) {
        return this.get('/reports/best-customers?limit=' + limit);
    },

    async downloadMonthlyReport(year, month) {
        const blob = await this.download('/reports/download-monthly?year=' + year + '&month=' + month);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Sales_Report_' + year + '_' + month + '.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    },

    async importExcel(file) {
        const formData = new FormData();
        formData.append('file', file);
        return this.upload('/reports/import-excel', formData);
    }
};