const API_BASE_URL = 'http://localhost:5000/api';
let medicines = [];
let editingMedicineId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadMedicines();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('medicineForm').addEventListener('submit', handleAddMedicine);
    document.getElementById('searchInput').addEventListener('input', filterMedicines);
    document.getElementById('categoryFilter').addEventListener('change', filterMedicines);
}

// Load all medicines from the server
async function loadMedicines() {
    try {
        const response = await fetch(`${API_BASE_URL}/medicines`);
        if (response.ok) {
            medicines = await response.json();
            displayMedicines(medicines);
            updateStats();
        } else {
            showAlert('Failed to load medicines', 'danger');
        }
    } catch (error) {
        console.error('Error loading medicines:', error);
        showAlert('Error connecting to server', 'danger');
    }
}

// Display medicines in the table
function displayMedicines(medicineList) {
    const tbody = document.getElementById('medicineTableBody');
    tbody.innerHTML = '';

    medicineList.forEach(medicine => {
        const row = document.createElement('tr');
        
        // Check for low stock and expiry alerts
        const isLowStock = medicine.quantity < 10;
        const isExpiringSoon = isExpiring(medicine.expiryDate, 30);
        const isExpired = new Date(medicine.expiryDate) < new Date();
        
        if (isExpired) {
            row.classList.add('expired');
        } else if (isExpiringSoon) {
            row.classList.add('expiring-soon');
        } else if (isLowStock) {
            row.classList.add('low-stock');
        }

        row.innerHTML = `
            <td>${medicine.name}</td>
            <td>${medicine.company}</td>
            <td>${medicine.batchNo}</td>
            <td>${medicine.quantity}</td>
            <td>₹${medicine.price.toFixed(2)}</td>
            <td>${formatDate(medicine.expiryDate)}</td>
            <td>${medicine.category}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editMedicine('${medicine._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteMedicine('${medicine._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Handle adding new medicine
async function handleAddMedicine(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const medicineData = {
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        batchNo: document.getElementById('batchNo').value,
        quantity: parseInt(document.getElementById('quantity').value),
        price: parseFloat(document.getElementById('price').value),
        expiryDate: document.getElementById('expiryDate').value,
        category: document.getElementById('category').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/medicines`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(medicineData)
        });

        if (response.ok) {
            showAlert('Medicine added successfully!', 'success');
            clearForm();
            loadMedicines();
        } else {
            showAlert('Failed to add medicine', 'danger');
        }
    } catch (error) {
        console.error('Error adding medicine:', error);
        showAlert('Error connecting to server', 'danger');
    }
}

// Edit medicine
function editMedicine(id) {
    const medicine = medicines.find(m => m._id === id);
    if (medicine) {
        document.getElementById('editId').value = medicine._id;
        document.getElementById('editName').value = medicine.name;
        document.getElementById('editCompany').value = medicine.company;
        document.getElementById('editBatchNo').value = medicine.batchNo;
        document.getElementById('editQuantity').value = medicine.quantity;
        document.getElementById('editPrice').value = medicine.price;
        document.getElementById('editExpiryDate').value = medicine.expiryDate.split('T')[0];
        document.getElementById('editCategory').value = medicine.category;
        
        const modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show();
    }
}

// Update medicine
async function updateMedicine() {
    const id = document.getElementById('editId').value;
    const medicineData = {
        name: document.getElementById('editName').value,
        company: document.getElementById('editCompany').value,
        batchNo: document.getElementById('editBatchNo').value,
        quantity: parseInt(document.getElementById('editQuantity').value),
        price: parseFloat(document.getElementById('editPrice').value),
        expiryDate: document.getElementById('editExpiryDate').value,
        category: document.getElementById('editCategory').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(medicineData)
        });

        if (response.ok) {
            showAlert('Medicine updated successfully!', 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            modal.hide();
            loadMedicines();
        } else {
            showAlert('Failed to update medicine', 'danger');
        }
    } catch (error) {
        console.error('Error updating medicine:', error);
        showAlert('Error connecting to server', 'danger');
    }
}

// Delete medicine
async function deleteMedicine(id) {
    if (confirm('Are you sure you want to delete this medicine?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showAlert('Medicine deleted successfully!', 'success');
                loadMedicines();
            } else {
                showAlert('Failed to delete medicine', 'danger');
            }
        } catch (error) {
            console.error('Error deleting medicine:', error);
            showAlert('Error connecting to server', 'danger');
        }
    }
}

// Filter medicines
function filterMedicines() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    const filteredMedicines = medicines.filter(medicine => {
        const matchesSearch = medicine.name.toLowerCase().includes(searchTerm) ||
                             medicine.company.toLowerCase().includes(searchTerm) ||
                             medicine.batchNo.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || medicine.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    displayMedicines(filteredMedicines);
}

// Update statistics
function updateStats() {
    const totalMedicines = medicines.length;
    const lowStock = medicines.filter(m => m.quantity < 10).length;
    const expiringSoon = medicines.filter(m => isExpiring(m.expiryDate, 30)).length;
    const totalValue = medicines.reduce((sum, m) => sum + (m.quantity * m.price), 0);
    
    document.getElementById('totalMedicines').textContent = totalMedicines;
    document.getElementById('lowStock').textContent = lowStock;
    document.getElementById('expiringSoon').textContent = expiringSoon;
    document.getElementById('totalValue').textContent = `₹${totalValue.toFixed(2)}`;
}

// Utility functions
function isExpiring(expiryDate, days) {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days && diffDays >= 0;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
}

function clearForm() {
    document.getElementById('medicineForm').reset();
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Export to CSV
function exportToCSV() {
    const headers = ['Name', 'Company', 'Batch No', 'Quantity', 'Price (₹)', 'Expiry Date', 'Category'];
    const csvContent = [
        headers.join(','),
        ...medicines.map(medicine => [
            medicine.name,
            medicine.company,
            medicine.batchNo,
            medicine.quantity,
            medicine.price,
            formatDate(medicine.expiryDate),
            medicine.category
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medicines_inventory.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Implement logout logic here
        window.location.reload();
    }
}
