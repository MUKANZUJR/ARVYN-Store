// script.js

// Function to add product to cart
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add product to cart
    cart.push({ name: name, price: price });

    // Save cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${name} added to cart!`);
}

// Function to display cart items on cart.html
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalContainer.innerText = '$0.00';
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <p><strong>${item.name}</strong> - $${item.price.toFixed(2)}</p>
            <button onclick="removeItem(${index})">Remove</button>
        `;
        cartContainer.appendChild(itemDiv);
    });

    totalContainer.innerText = `$${total.toFixed(2)}`;
}

// Function to remove an item from cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}
// script.js

// Existing functions: addToCart, displayCart, removeItem

// Update cart count in header
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartLinks = document.querySelectorAll('nav a');
    cartLinks.forEach(link => {
        if (link.textContent.includes('🛒')) {
            link.textContent = `🛒 Cart (${cart.length})`;
        }
    });
}

// Call updateCartCount after adding or removing items
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name: name, price: price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} added to cart!`);
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Call this when any page loads to show correct cart count
document.addEventListener('DOMContentLoaded', updateCartCount);