// ===========================
// SIMPLE FRONT-END INVOICE LOGIC ONLY
// ===========================

// STATE
const invoiceState = {
    lineItems: [
        'Custom Website Design & Development (Up to 5 Pages)',
        'Responsive & Mobile-Friendly Layout (optimized for all devices)',
        'User-Friendly Content Management System (CMS) (easy updates without coding)',
        'Contact Form Integration',
        'Google Maps Integration',
        'Basic On-Page SEO Setup (meta tags, headings, alt text, speed optimization)',
        'Social Media Integration (Facebook, Instagram, LinkedIn links/buttons)',
        'Image Optimization & Galleries (for better SEO and user experience)',
        'Training & Documentation'
    ]
};

// ===========================
// UTILITY FUNCTIONS
// ===========================
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getDatePlusDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', function () {
    initializeDates();
    renderLineItems();
    attachEventListeners();
    updateInvoicePreview();
});

function initializeDates() {
    const dateInput = document.getElementById('invoiceDate');
    const validUntilInput = document.getElementById('validUntil');

    dateInput.value = getCurrentDate();
    validUntilInput.value = getDatePlusDays(5);
}

// ===========================
// LINE ITEMS MANAGEMENT
// ===========================
function renderLineItems() {
    const container = document.getElementById('lineItemsContainer');
    container.innerHTML = '';

    invoiceState.lineItems.forEach((item, index) => {
        const lineItemDiv = document.createElement('div');
        lineItemDiv.className = 'line-item';
        lineItemDiv.innerHTML = `
            <div class="line-item-header">
                <span class="line-item-number">Item ${index + 1}</span>
                <button class="btn-remove" onclick="removeLineItem(${index})">Remove</button>
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" 
                       class="line-item-input" 
                       data-index="${index}" 
                       value="${item}"
                       placeholder="Enter item description">
            </div>
        `;
        container.appendChild(lineItemDiv);
    });

    // update state on change
    document.querySelectorAll('.line-item-input').forEach(input => {
        input.addEventListener('input', function () {
            const index = parseInt(this.dataset.index);
            invoiceState.lineItems[index] = this.value;
        });
    });
}

function removeLineItem(index) {
    if (invoiceState.lineItems.length <= 1) {
        alert('You must have at least one line item.');
        return;
    }

    invoiceState.lineItems.splice(index, 1);
    renderLineItems();
    updateInvoicePreview();
}

function addLineItem() {
    invoiceState.lineItems.push('New Item');
    renderLineItems();
    updateInvoicePreview();
}

// ===========================
// INVOICE PREVIEW UPDATE
// ===========================
function updateInvoicePreview() {
    // Company Details
    document.getElementById('displayCompanyName').textContent =
        document.getElementById('companyName').value;
    document.getElementById('displayTagline').textContent =
        document.getElementById('companyTagline').value;
    // logo initials remove chesam – image matrame use chestunnam

    // Invoice Details
    document.getElementById('displayQuotationNumber').textContent =
        document.getElementById('quotationNumber').value;
    document.getElementById('displayDate').textContent =
        formatDate(document.getElementById('invoiceDate').value);
    document.getElementById('displayValidUntil').textContent =
        formatDate(document.getElementById('validUntil').value);

    // Client Details
    document.getElementById('displayClientName').textContent =
        document.getElementById('clientName').value;
    document.getElementById('displayClientCompany').textContent =
        document.getElementById('clientCompany').value;
    document.getElementById('displayClientAddress').textContent =
        document.getElementById('clientAddress').value;
    document.getElementById('displayClientContact').textContent =
        document.getElementById('clientContact').value;

    // Project Details
    document.getElementById('displayProjectName').textContent =
        document.getElementById('projectName').value;
    document.getElementById('displayDelivery').textContent =
        document.getElementById('deliveryTime').value;
    document.getElementById('displayMaintenance').textContent =
        document.getElementById('maintenance').value;

    // Line Items Table (single row, left side list, total on right)
    const tableBody = document.getElementById('itemsTableBody');
    tableBody.innerHTML = '';

    const itemsCell = document.createElement('td');
    const ul = document.createElement('ul');

    invoiceState.lineItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
    });
    itemsCell.appendChild(ul);

    const totalCell = document.createElement('td');
    const packageCost = parseFloat(document.getElementById('packageCost').value) || 0;
    totalCell.textContent = formatCurrency(packageCost);

    const row = document.createElement('tr');
    row.appendChild(itemsCell);
    row.appendChild(totalCell);
    tableBody.appendChild(row);

    // Pricing
    const discountAmount = parseFloat(document.getElementById('discountAmount').value) || 0;
    const grandTotal = packageCost - discountAmount;

    document.getElementById('displayPackageCost').textContent = formatCurrency(packageCost);
    document.getElementById('displayDiscountName').textContent =
        document.getElementById('discountName').value;
    document.getElementById('displayDiscountAmount').textContent =
        '- ' + formatCurrency(discountAmount);
    document.getElementById('displayGrandTotal').textContent = formatCurrency(grandTotal);
}

// ===========================
// EVENT LISTENERS
// ===========================
function attachEventListeners() {
    document.getElementById('updateInvoice').addEventListener('click', function () {
        updateInvoicePreview();
        showNotification('Invoice updated successfully!', 'success');
    });

    document.getElementById('addLineItem').addEventListener('click', function () {
        addLineItem();
    });

    document.getElementById('printInvoice').addEventListener('click', function () {
        window.print();
    });

    document.getElementById('resetForm').addEventListener('click', function () {
        if (confirm('Are you sure you want to reset to default values?')) {
            resetToDefault();
        }
    });

    document.getElementById('togglePanel').addEventListener('click', function () {
        const panel = document.getElementById('controlPanel');
        panel.classList.toggle('hidden');
    });

    // Auto-update on change
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', debounce(updateInvoicePreview, 400));
    });
}

// ===========================
// RESET TO DEFAULT
// ===========================
function resetToDefault() {
    document.getElementById('companyName').value = 'PRANAYUV TECHNOLOGIES PVT LTD';
    document.getElementById('companyTagline').value = 'Empowering Lives through Innovation';
    document.getElementById('logoText').value = 'PV';

    document.getElementById('quotationNumber').value = 'Q2025001';
    initializeDates();

    document.getElementById('clientName').value = 'Apna Advertising';
    document.getElementById('clientCompany').value = 'Apna Advertising Pvt Ltd';
    document.getElementById('clientAddress').value = 'Pahar Ganj, New Delhi 110055';
    document.getElementById('clientContact').value = '9389271138';

    document.getElementById('projectName').value = 'Website development (Up to 5 pages)';
    document.getElementById('deliveryTime').value = '3-4 weeks from advance & assets';
    document.getElementById('maintenance').value = '18 months included (1 hour/month basic updates)';

    invoiceState.lineItems = [
        'Custom Website Design & Development (Up to 5 Pages)',
        'Responsive & Mobile-Friendly Layout (optimized for all devices)',
        'User-Friendly Content Management System (CMS) (easy updates without coding)',
        'Contact Form Integration',
        'Google Maps Integration',
        'Basic On-Page SEO Setup (meta tags, headings, alt text, speed optimization)',
        'Social Media Integration (Facebook, Instagram, LinkedIn links/buttons)',
        'Image Optimization & Galleries (for better SEO and user experience)',
        'Training & Documentation'
    ];

    document.getElementById('packageCost').value = '20000';
    document.getElementById('discountName').value = 'Inaugural Client Discount (FIRST50)';
    document.getElementById('discountAmount').value = '8000';

    renderLineItems();
    updateInvoicePreview();
    showNotification('Reset to default values', 'info');
}

// ===========================
// SMALL HELPERS
// ===========================
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#4caf50'
                  : type === 'error'   ? '#f44336'
                  : '#2196F3',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '10000',
        fontWeight: '500'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

console.log('✅ Simple Quotation Invoice script loaded');
