
// 1. Dynamic Order Data
const orderData = {
    products: [
        { name: "Product A", price: 20.00 },
        { name: "Product B", price: 15.00 }
    ],
    shipping: 5.00
};

// 2. Dynamic Summary Rendering Logic
function renderOrderSummary() {
    const container = document.getElementById('dynamicSummaryItems');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing contents
    let subtotal = 0;

    // Generate product list items
    orderData.products.forEach(item => {
        subtotal += item.price;
        const row = document.createElement('div');
        row.className = 'summary-row';
        row.innerHTML = `<span>${item.name}</span><span>$${item.price.toFixed(2)}</span>`;
        container.appendChild(row);
    });

    // Generate shipping row
    const shippingRow = document.createElement('div');
    shippingRow.className = 'summary-row';
    shippingRow.innerHTML = `<span>Shipping</span><span>$${orderData.shipping.toFixed(2)}</span>`;
    container.appendChild(shippingRow);

    // Decorative line separator
    const hr = document.createElement('hr');
    hr.className = 'light-divider';
    container.appendChild(hr);

    // Calculate Grand Total
    const totalAmount = subtotal + orderData.shipping;
    const totalRow = document.createElement('div');
    totalRow.className = 'summary-row total';
    totalRow.innerHTML = `<span>Total</span><span>$${totalAmount.toFixed(2)}</span>`;
    container.appendChild(totalRow);
}

// 3. Centralized Field Validation Engine
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

function validateField(inputElement, errorElement, type) {
    const value = inputElement.value.trim();
    
    // Default valid state
    let isInvalid = false;
    let errorMessage = '';

    // Assessment validation requirements ruleset
    if (type === 'name') {
        if (value === '') {
            isInvalid = true;
            errorMessage = 'Full name is required.';
        }
    } else if (type === 'email') {
        if (value === '') {
            isInvalid = true;
            errorMessage = 'Email is required.';
        } else if (!emailRegex.test(value)) {
            isInvalid = true;
            errorMessage = 'Please enter a valid email format.';
        }
    } else if (type === 'address') {
        if (value === '') {
            isInvalid = true;
            errorMessage = 'Address is required.';
        }
    }

    // Apply or clean validation UI styles based on evaluation
    if (isInvalid) {
        inputElement.classList.add('invalid');
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
        return false;
    } else {
        inputElement.classList.remove('invalid');
        errorElement.style.display = 'none';
        return true;
    }
}

// 4. Form Lifecycle & Interactive Event Tracking
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render of the Order Summary Card
    renderOrderSummary();

    const form = document.getElementById('checkoutForm');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const formStatus = document.getElementById('formStatus');

    // UI elements for error text targeting
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const addressError = document.getElementById('addressError');

    // "Dirty/Touched" State Tracking: Validate when a user steps away from an input field
    fullName.addEventListener('blur', () => validateField(fullName, nameError, 'name'));
    email.addEventListener('blur', () => validateField(email, emailError, 'email'));
    address.addEventListener('blur', () => validateField(address, addressError, 'address'));

    // Real-time clearing: Remove warning states immediately while typing if the field becomes valid
    fullName.addEventListener('input', () => {
        if (fullName.value.trim() !== '') {
            fullName.classList.remove('invalid');
            nameError.style.display = 'none';
        }
    });

    email.addEventListener('input', () => {
        if (email.value.trim() !== '' && emailRegex.test(email.value.trim())) {
            email.classList.remove('invalid');
            emailError.style.display = 'none';
        }
    });

    address.addEventListener('input', () => {
        if (address.value.trim() !== '') {
            address.classList.remove('invalid');
            addressError.style.display = 'none';
        }
    });

    // Handle Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Run validation across all fields at once on submit event
        const isNameValid = validateField(fullName, nameError, 'name');
        const isEmailValid = validateField(email, emailError, 'email');
        const isAddressValid = validateField(address, addressError, 'address');

        // Form rejection handling block
        if (!isNameValid || !isEmailValid || !isAddressValid) {
            formStatus.className = 'status-msg error';
            formStatus.textContent = 'Please correct the invalid fields above.';
            return;
        }

        // Gather checked choice data
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const subtotal = orderData.products.reduce((sum, p) => sum + p.price, 0);
        
        const payload = {
            fullName: fullName.value.trim(),
            email: email.value.trim(),
            address: address.value.trim(),
            paymentMethod: paymentMethod,
            totalAmount: subtotal + orderData.shipping
        };

        // Form Success Sequence - Launch Simulated API Routine
        formStatus.className = 'status-msg info';
        formStatus.textContent = 'Submitting order to Samrisa Infotech API...';

        simulateApiCall(payload)
            .then(response => {
                formStatus.className = 'status-msg success';
                formStatus.textContent = response.message;
                
                // Optional: Clear form contents on explicit success lifecycle
                form.reset();
                renderOrderSummary(); // Re-render initial pricing state after form resets
            })
            .catch(err => {
                formStatus.className = 'status-msg error';
                formStatus.textContent = err.message || 'Server error occurred.';
            });
    });
});

// 5. Real Async API Connection to .NET Core Backend
function simulateApiCall(data) {
    const backendApiUrl = 'https://localhost:7157/api/billing/checkout'; 

    return fetch(backendApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(async (response) => {
        const result = await response.json();
        
        if (!response.ok) {
            const errorMsg = result.message || 'Server validation failed.';
            throw new Error(errorMsg);
        }
        
        return result; 
    });
}