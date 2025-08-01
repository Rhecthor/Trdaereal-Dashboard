// Global variables
let orders = [];
let shipments = [];
let currentPage = 'dashboard';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializePreloader();
    initializeNavigation();
    generateSampleData();
    initializeCharts();
    populateOrdersTable();
    populateShipmentsGrid();
    populateActivityFeed();
    updateMetrics();
    setupEventListeners();
    loadOrdersToDashboard(); // Load orders from localStorage
});

// Preloader
function initializePreloader() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500);
}

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Hide all pages
            pages.forEach(page => page.classList.remove('active'));
            
            // Show selected page
            const targetPage = item.getAttribute('data-page');
            const targetElement = document.getElementById(targetPage);
            if (targetElement) {
                targetElement.classList.add('active');
                currentPage = targetPage;
            }
            
            // Update page-specific content
            updatePageContent(targetPage);
        });
    });
}

// Generate sample data
function generateSampleData() {
    // Generate sample orders
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const priorities = ['high', 'medium', 'low'];
    const customers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Lisa Garcia', 'Tom Anderson', 'Emily Davis'];
    const products = ['iPhone 15 Pro', 'MacBook Air', 'AirPods Pro', 'iPad Pro', 'Apple Watch', 'Samsung Galaxy S24', 'Dell Laptop', 'Sony Headphones'];
    
    orders = [];
    for (let i = 1; i <= 50; i++) {
        const order = {
            id: `ORD${String(i).padStart(3, '0')}`,
            customer: customers[Math.floor(Math.random() * customers.length)],
            product: products[Math.floor(Math.random() * products.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            amount: (Math.random() * 2000 + 100).toFixed(2),
            trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        };
        orders.push(order);
    }
    
    // Generate sample shipments
    shipments = orders.filter(order => order.status === 'shipped' || order.status === 'processing').map(order => ({
        ...order,
        progress: Math.floor(Math.random() * 100),
        estimatedDelivery: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        currentLocation: ['Distribution Center', 'In Transit', 'Local Facility', 'Out for Delivery'][Math.floor(Math.random() * 4)]
    }));
}

// Initialize charts
function initializeCharts() {
    initializeShipmentChart();
    initializePerformanceChart();
    initializeCostsChart();
    initializeAnalyticsCharts();
}

// Shipment status chart
function initializeShipmentChart() {
    const ctx = document.getElementById('shipmentChart');
    if (!ctx) return;
    
    const statusCounts = {
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pending', 'Processing', 'Shipped', 'Delivered'],
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#f59e0b', '#2563eb', '#7c3aed', '#10b981'],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

// Performance chart
function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'On-Time Deliveries',
                data: [92, 95, 97, 93, 98, 96, 99],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34,197,94,0.08)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Deliveries (%)' }
                }
            }
        }
    });
}

// Costs chart
function initializeCostsChart() {
    const ctx = document.getElementById('costsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Shipping Cost ($)',
                data: [1200, 1100, 1300, 1250, 1400, 1350, 1500],
                backgroundColor: '#60a5fa'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Cost ($)' }
                }
            }
        }
    });
}

// Customer Growth Line Chart
function initializeAnalyticsCharts() {
    // Customer Growth Line Chart
    const customerGrowthCanvas = document.getElementById('customerGrowthChart');
    if (customerGrowthCanvas) {
        new Chart(customerGrowthCanvas, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Customers',
                    data: [120, 150, 180, 210, 250, 300, 350],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37,99,235,0.08)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Customers' }
                    }
                }
            }
        });
    }

    // Returns Rate Chart (Doughnut)
    const returnsRateCanvas = document.getElementById('returnsRateChart');
    if (returnsRateCanvas) {
        new Chart(returnsRateCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Returned', 'Delivered'],
                datasets: [{
                    data: [15, 285],
                    backgroundColor: ['#ef4444', '#22c55e']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, position: 'bottom' }
                },
                cutout: '70%'
            }
        });
    }
}

// Populate orders table
function populateOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = orders.slice(0, 20).map(order => `
        <tr>
            <td><input type="checkbox" data-order-id="${order.id}"></td>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td><span class="status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
            <td><span class="priority ${order.priority}">${order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}</span></td>
            <td>${order.date}</td>
            <td>$${order.amount}</td>
            <td>
                <button class="btn-primary" onclick="viewOrder('${order.id}')">View</button>
                <button class="btn-secondary" onclick="trackOrder('${order.trackingNumber}')">Track</button>
            </td>
        </tr>
    `).join('');
}

// Populate shipments grid
function populateShipmentsGrid() {
    const grid = document.getElementById('shipmentsGrid');
    if (!grid) return;
    
    grid.innerHTML = shipments.slice(0, 12).map(shipment => `
        <div class="shipment-card">
            <div class="shipment-header">
                <div class="tracking-number">${shipment.trackingNumber}</div>
                <span class="status ${shipment.status}">${shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}</span>
            </div>
            <div class="shipment-details">
                <p><strong>Customer:</strong> ${shipment.customer}</p>
                <p><strong>Product:</strong> ${shipment.product}</p>
                <p><strong>Current Location:</strong> ${shipment.currentLocation}</p>
                <p><strong>Est. Delivery:</strong> ${shipment.estimatedDelivery}</p>
            </div>
            <div class="shipment-progress">
                <div class="progress-label">Progress: ${shipment.progress}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${shipment.progress}%"></div>
                </div>
            </div>
            <div class="shipment-actions">
                <button class="btn-secondary" onclick="trackOrder('${shipment.trackingNumber}')">Track</button>
                <button class="btn-primary" onclick="updateShipment('${shipment.id}')">Update</button>
            </div>
        </div>
    `).join('');
}

// Populate activity feed
function populateActivityFeed() {
    const feed = document.getElementById('activityFeed');
    if (!feed) return;
    
    const activities = [
        { icon: 'bi-box-seam', iconClass: 'processing', title: 'New order received', time: '2 minutes ago' },
        { icon: 'bi-truck', iconClass: 'shipped', title: 'Package shipped to customer', time: '15 minutes ago' },
        { icon: 'bi-check-circle', iconClass: 'delivered', title: 'Delivery completed', time: '1 hour ago' },
        { icon: 'bi-exclamation-triangle', iconClass: 'delayed', title: 'Shipment delayed', time: '2 hours ago' },
        { icon: 'bi-person-plus', iconClass: 'processing', title: 'New customer registered', time: '3 hours ago' }
    ];
    
    feed.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.iconClass}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="title">${activity.title}</div>
                <div class="time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Update metrics
function updateMetrics() {
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const processingCount = orders.filter(o => o.status === 'processing').length;
    const shippedCount = orders.filter(o => o.status === 'shipped').length;
    const deliveredCount = orders.filter(o => o.status === 'delivered').length;
    const delayedCount = Math.floor(Math.random() * 15) + 5; // Simulated
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.amount), 0);
    
    document.getElementById('pendingOrders').textContent = pendingCount;
    document.getElementById('processingOrders').textContent = processingCount;
    document.getElementById('shippedOrders').textContent = shippedCount;
    document.getElementById('deliveredOrders').textContent = deliveredCount;
    document.getElementById('delayedOrders').textContent = delayedCount;
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toLocaleString();
}

// Setup event listeners
function setupEventListeners() {
    // Global search
    document.getElementById('globalSearch').addEventListener('input', handleGlobalSearch);
    
    // Order filters
    document.getElementById('statusFilter')?.addEventListener('change', filterOrders);
    document.getElementById('priorityFilter')?.addEventListener('change', filterOrders);
    document.getElementById('dateFilter')?.addEventListener('change', filterOrders);
    
    // Select all checkbox
    document.getElementById('selectAll')?.addEventListener('change', handleSelectAll);
    
    // Tracking input
    document.getElementById('trackingInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') trackShipment();
    });
    
    // Real-time updates
    setInterval(simulateRealTimeUpdates, 30000); // Every 30 seconds
}

// Handle global search
function handleGlobalSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    console.log('Searching for:', searchTerm);
    
    if (currentPage === 'orders') {
        filterOrdersBySearch(searchTerm);
    }
}

// Filter orders by search
function filterOrdersBySearch(searchTerm) {
    const filteredOrders = orders.filter(order => 
        order.id.toLowerCase().includes(searchTerm) ||
        order.customer.toLowerCase().includes(searchTerm) ||
        order.product.toLowerCase().includes(searchTerm) ||
        order.trackingNumber.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredOrders(filteredOrders);
}

// Filter orders
function filterOrders() {
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    let filteredOrders = orders;
    
    if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    if (priorityFilter) {
        filteredOrders = filteredOrders.filter(order => order.priority === priorityFilter);
    }
    
    if (dateFilter) {
        filteredOrders = filteredOrders.filter(order => order.date === new Date(dateFilter).toLocaleDateString());
    }
    
    displayFilteredOrders(filteredOrders);
}

// Display filtered orders
function displayFilteredOrders(filteredOrders) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td><input type="checkbox" data-order-id="${order.id}"></td>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td><span class="status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
            <td><span class="priority ${order.priority}">${order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}</span></td>
            <td>${order.date}</td>
            <td>$${order.amount}</td>
            <td>
                <button class="btn-primary" onclick="viewOrder('${order.id}')">View</button>
                <button class="btn-secondary" onclick="trackOrder('${order.trackingNumber}')">Track</button>
            </td>
        </tr>
    `).join('');
}

// Clear filters
function clearFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('priorityFilter').value = '';
    document.getElementById('dateFilter').value = '';
    populateOrdersTable();
}

// Handle select all
function handleSelectAll(e) {
    const checkboxes = document.querySelectorAll('input[data-order-id]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
    });
}

// View order details
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderModal');
    const modalBody = document.getElementById('orderModalBody');
    
    modalBody.innerHTML = `
        <div class="order-details">
            <h3>Order ${order.id}</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Customer:</label>
                    <span>${order.customer}</span>
                </div>
                <div class="detail-item">
                    <label>Product:</label>
                    <span>${order.product}</span>
                </div>
                <div class="detail-item">
                    <label>Status:</label>
                    <span class="status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                </div>
                <div class="detail-item">
                    <label>Priority:</label>
                    <span class="priority ${order.priority}">${order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}</span>
                </div>
                <div class="detail-item">
                    <label>Date:</label>
                    <span>${order.date}</span>
                </div>
                <div class="detail-item">
                    <label>Amount:</label>
                    <span>$${order.amount}</span>
                </div>
                <div class="detail-item">
                    <label>Tracking Number:</label>
                    <span>${order.trackingNumber}</span>
                </div>
            </div>
            <div class="order-actions">
                <button class="btn-primary" onclick="updateOrderStatus('${order.id}')">Update Status</button>
                <button class="btn-secondary" onclick="trackOrder('${order.trackingNumber}')">Track Package</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Track order
function trackOrder(trackingNumber) {
    // Navigate to tracking page
    document.querySelector('[data-page="tracking"]').click();
    
    // Set tracking number in input
    setTimeout(() => {
        document.getElementById('trackingInput').value = trackingNumber;
        trackShipment();
    }, 100);
}

// Track shipment
function trackShipment() {
    const trackingNumber = document.getElementById('trackingInput').value;
    if (!trackingNumber) return;
    
    const resultsContainer = document.getElementById('trackingResults');
    
    // Simulate tracking data
    const trackingData = {
        trackingNumber: trackingNumber,
        status: 'In Transit',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        timeline: [
            { status: 'Order Placed', location: 'Online', time: '2 days ago', completed: true },
            { status: 'Order Processed', location: 'Warehouse', time: '1 day ago', completed: true },
            { status: 'Shipped', location: 'Distribution Center', time: '12 hours ago', completed: true },
            { status: 'In Transit', location: 'Local Facility', time: '2 hours ago', completed: true, current: true },
            { status: 'Out for Delivery', location: 'Delivery Vehicle', time: 'Pending', completed: false },
            { status: 'Delivered', location: 'Customer Address', time: 'Pending', completed: false }
        ]
    };
    
    resultsContainer.innerHTML = `
        <div class="tracking-info">
            <h3>Tracking: ${trackingData.trackingNumber}</h3>
            <p><strong>Status:</strong> ${trackingData.status}</p>
            <p><strong>Estimated Delivery:</strong> ${trackingData.estimatedDelivery}</p>
        </div>
        <div class="tracking-timeline">
            ${trackingData.timeline.map(item => `
                <div class="timeline-item">
                    <div class="timeline-icon ${item.completed ? 'completed' : 'pending'} ${item.current ? 'current' : ''}">
                        <i class="bi bi-${item.completed ? 'check' : 'clock'}"></i>
                    </div>
                    <div class="timeline-content">
                        <h4>${item.status}</h4>
                        <p>${item.location}</p>
                        <div class="time">${item.time}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Update page content
function updatePageContent(page) {
    switch (page) {
        case 'orders':
            populateOrdersTable();
            break;
        case 'shipments':
            populateShipmentsGrid();
            break;
        case 'delivery':
            populateDeliveryTimeline();
            break;
        case 'analytics':
            initializePerformanceChart();
            initializeCostsChart();
            initializeAnalyticsCharts(); // <-- Add this line
            break;
    }
}

// Populate delivery timeline
function populateDeliveryTimeline() {
    const timeline = document.getElementById('deliveryTimeline');
    if (!timeline) return;
    
    const deliveredOrders = orders.filter(o => o.status === 'delivered').slice(0, 10);
    
    timeline.innerHTML = deliveredOrders.map(order => `
        <div class="delivery-item">
            <div class="delivery-time">${order.date}</div>
            <div class="delivery-details">
                <h4>${order.id} - ${order.customer}</h4>
                <p>${order.product}</p>
                <span class="status delivered">Delivered</span>
            </div>
        </div>
    `).join('');
}

// Add this to a <script> tag in dashboard.html or your dashboard JS file

function loadOrdersToDashboard() {
    const ordersContainer = document.getElementById('dashboardOrders');
    if (!ordersContainer) return;
    ordersContainer.innerHTML = ''; // Remove the table and show nothing
}

// Call this on page load
window.addEventListener('DOMContentLoaded', loadOrdersToDashboard);

// Make sure Chart.js and ChartDataLabels are loaded in your HTML

Chart.register(window.ChartDataLabels);

// Common chart options for sizing
const chartOptions = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: true, position: 'bottom' }
    }
};

// Shipment Status Distribution (Pie/Donut)
const shipmentChart = new Chart(document.getElementById('shipmentChart').getContext('2d'), {
    type: 'doughnut',
    data: {
        labels: ['Pending', 'Processing', 'In Transit', 'Delivered', 'Delayed'],
        datasets: [{
            data: [20, 7, 10, 30, 3],
            backgroundColor: [
                '#fbbf24', // Pending
                '#60a5fa', // Processing
                '#818cf8', // In Transit
                '#22c55e', // Delivered
                '#ef4444'  // Delayed
            ]
        }]
    },
    options: {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            datalabels: {
                display: true // <--- Hide all datalabels/letters
            }
        },
        cutout: '65%',
    },
    plugins: [ChartDataLabels]
});

// Delivery Success Rate (Gauge-like Doughnut)
const successRateChart = new Chart(document.getElementById('successRateChart').getContext('2d'), {
    type: 'doughnut',
    data: {
        labels: ['Success', 'Failed'],
        datasets: [{
            data: [95, 5],
            backgroundColor: ['#22c55e', '#ef4444']
        }]
    },
    options: {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            datalabels: {
                display: true // <--- Hide all datalabels/letters
            },
            legend: { display: false }
        },
        cutout: '80%',
        rotation: -90,
        circumference: 180,
    },
    plugins: [ChartDataLabels]
});

// Average Delivery Time (Bar)
const avgDeliveryChart = new Chart(document.getElementById('avgDeliveryChart').getContext('2d'), {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Avg Delivery Time (hrs)',
            data: [24, 22, 20, 19, 18, 21, 23],
            backgroundColor: '#60a5fa'
        }]
    },
    options: {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            datalabels: {
                display: true 
            },
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Hours' }
            }
        }
    },
    plugins: [ChartDataLabels]
});

// Big Real-Time Chart for Live Shipment Tracking
const bigRealtimeChart = new Chart(document.getElementById('bigRealtimeChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: Array.from({length: 20}, (_, i) => `T-${20 - i}`),
        datasets: [{
            label: 'Active Shipments',
            data: Array.from({length: 20}, () => 100 + Math.floor(Math.random() * 30)),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37,99,235,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 3
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' }
        },
        scales: {
            x: {
                display: true,
                title: { display: false }
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Shipments' }
            }
        }
    }
});

// Real-time update for big chart
setInterval(() => {
    const chart = bigRealtimeChart;
    // Remove oldest data point
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
    // Add new data point
    const last = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1] || 100;
    const next = Math.max(80, Math.min(160, last + Math.floor(Math.random() * 11 - 5)));
    chart.data.labels.push(`T-${Math.floor(Math.random()*100)}`);
    chart.data.datasets[0].data.push(next);
    chart.update();
}, 2000);

// --- Real-time update simulation ---
setInterval(() => {
    // Randomly update shipment status
    shipmentChart.data.datasets[0].data = shipmentChart.data.datasets[0].data.map(
        v => Math.max(0, v + Math.floor(Math.random() * 3 - 1))
    );
    shipmentChart.update();

    // Randomly update success rate
    const success = 90 + Math.floor(Math.random() * 10);
    successRateChart.data.datasets[0].data = [success, 100 - success];
    successRateChart.update();

    // Randomly update avg delivery time
    avgDeliveryChart.data.datasets[0].data = avgDeliveryChart.data.datasets[0].data.map(
        v => Math.max(15, Math.min(30, v + Math.floor(Math.random() * 3 - 1)))
    );
    avgDeliveryChart.update();
}, 4000);

// Utility functions
function addNewOrder() {
    alert('Add New Order functionality would open a form here');
}

function bulkUpdate() {
    const selectedOrders = document.querySelectorAll('input[data-order-id]:checked');
    if (selectedOrders.length === 0) {
        alert('Please select orders to update');
        return;
    }
    alert(`Bulk update for ${selectedOrders.length} orders`);
}

function exportOrders() {
    alert('Export functionality would download CSV/Excel file');
}

function updateOrderStatus(orderId) {
    alert(`Update status for order ${orderId}`);
}

function updateShipment(shipmentId) {
    alert(`Update shipment ${shipmentId}`);
}

function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// Add mobile menu button for smaller screens
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 992) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.innerHTML = '<i class="bi bi-list"></i>';
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.onclick = toggleMobileMenu;
        mobileMenuBtn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: var(--primary);
            color: white;
            border: none;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
        `;
        
        document.body.appendChild(mobileMenuBtn);
    }
});

window.addEventListener('storage', function(event) {
    if (event.key === 'orders') {
        loadOrdersToDashboard(); // This will reload the orders table in real time
    }
});

// Profile Edit
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Profile updated successfully!');
    // You can add localStorage or backend update logic here
});

// Dashboard Preferences
document.getElementById('dashboardPrefsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Preferences saved!');
    // You can add localStorage or backend update logic here
});

// Example: Dark mode toggle (for demonstration)
document.getElementById('darkModeToggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode', this.checked);
});

function loadNotifications() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const list = document.getElementById('notificationsList');
    if (!list) return;

    if (notifications.length === 0) {
        list.innerHTML = '<p>No notifications yet.</p>';
        return;
    }

    list.innerHTML = notifications.map(n => `
        <div class="notification-card">
            <div>
                <strong>${n.message}</strong>
                <div style="font-size:0.95em;color:#888;">${n.date}</div>
                <div style="font-size:0.95em;">Items: ${n.items && n.items.length ? n.items.map(i => i.name || 'Product').join(', ') : 'N/A'}</div>
            </div>
            <div class="notification-actions">
                <button class="btn-review" ${n.reviewed ? 'disabled' : ''} onclick="reviewOrder(${n.id})">
                    ${n.reviewed ? 'Reviewed' : 'Review Product'}
                </button>
                <button class="btn-ship" ${!n.reviewed || n.shipped ? 'disabled' : ''} onclick="startShipment(${n.id})">
                    ${n.shipped ? 'Shipment Started' : 'Start Shipment'}
                </button>
            </div>
        </div>
    `).join('');
}

// Review Product
window.reviewOrder = function(notificationId) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const idx = notifications.findIndex(n => n.id === notificationId);
    if (idx !== -1) {
        notifications[idx].reviewed = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
        loadNotifications();
    }
};

// Start Shipment
window.startShipment = function(notificationId) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const idx = notifications.findIndex(n => n.id === notificationId);
    if (idx !== -1 && notifications[idx].reviewed) {
        notifications[idx].shipped = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
        loadNotifications();
    }
};

// Real-time update: Listen for changes in localStorage
window.addEventListener('storage', function(event) {
    if (event.key === 'notifications') {
        loadNotifications();
    }
});

// Load notifications when the notifications page is shown
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('notificationsList')) {
        loadNotifications();
    }
});

// If you use page switching, call loadNotifications() when switching to the notifications page.