// Initial Mock Data
let inventory = [
    { id: 1, name: "Fresh Milk", expiry: "2026-01-30", category: "Dairy" },
    { id: 2, name: "Avocados (3)", expiry: "2026-02-02", category: "Vegetables" },
    { id: 3, name: "Chicken Breast", expiry: "2026-01-29", category: "Meat" },
    { id: 4, name: "Greek Yogurt", expiry: "2026-02-10", category: "Dairy" },
];

// DOM Elements
const inventoryList = document.getElementById('inventoryList');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const addItemForm = document.getElementById('addItemForm');

// Category Icons Map
const categoryIcons = {
    "Dairy": "ri-cup-line",
    "Vegetables": "ri-leaf-line",
    "Fruits": "ri-apple-line",
    "Meat": "ri-knife-line",
    "Grains": "ri-bread-line",
    "Beverages": "ri-drinks-line",
    "default": "ri-shopping-basket-2-line"
};

// Functions
function getDaysUntilExpiry(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function getStatusClass(days) {
    if (days <= 2) return 'status-critical';
    if (days <= 5) return 'status-warning';
    return 'status-good';
}

function getStatusText(days) {
    if (days < 0) return 'Expired';
    if (days === 0) return 'Expires Today';
    if (days === 1) return 'Expires Tomorrow';
    return `Expires in ${days} days`;
}

function renderInventory() {
    inventoryList.innerHTML = '';

    // Sort logic: Soonest expiry first
    const sortedInventory = [...inventory].sort((a, b) => new Date(a.expiry) - new Date(b.expiry));

    sortedInventory.forEach((item, index) => {
        const days = getDaysUntilExpiry(item.expiry);
        const statusClass = getStatusClass(days);
        const statusText = getStatusText(days);
        const icon = categoryIcons[item.category] || categoryIcons["default"];

        const itemHTML = `
            <div class="inventory-item" data-index="${index}">
                <div class="item-left">
                    <div class="item-icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>${item.category}</p>
                    </div>
                </div>
                <div class="item-right">
                    <span class="item-status ${statusClass}">${statusText}</span>
                </div>
            </div>
        `;
        inventoryList.insertAdjacentHTML('beforeend', itemHTML);
    });

    // Re-trigger animations for new elements
    animateInventoryItems();
}

// Modal Logic
function openModal() {
    modalOverlay.classList.add('active');
    gsap.fromTo(".modal",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
    );
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

// Form Submission
function handleAddItem(e) {
    e.preventDefault();

    // Simple ID generation
    const newId = inventory.length > 0 ? Math.max(...inventory.map(i => i.id)) + 1 : 1;

    const newItem = {
        id: newId,
        name: document.getElementById('itemName').value,
        expiry: document.getElementById('expiryDate').value,
        category: document.getElementById('category').value
    };

    inventory.push(newItem);
    renderInventory();
    closeModal();
    addItemForm.reset();
}

// GSAP Animations
function animatePageLoad() {
    const tl = gsap.timeline();

    tl.from('.sidebar', { x: -50, opacity: 0, duration: 0.8, ease: "power3.out" })
        .from('.top-bar', { y: -30, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .from('.stat-card', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out"
        }, "-=0.2")
        .from('.inventory-section', { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.2");

    // Initial render then animate items
    renderInventory();
}

function animateInventoryItems() {
    gsap.fromTo('.inventory-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
    );
}

// Event Listeners
document.addEventListener('DOMContentLoaded', animatePageLoad);
openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});
addItemForm.addEventListener('click', (e) => e.stopPropagation()); // Prevent closing when clicking form
addItemForm.addEventListener('submit', handleAddItem);

// Set default date to today + 7 days
const dateInput = document.getElementById('expiryDate');
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);
dateInput.value = nextWeek.toISOString().split('T')[0];
