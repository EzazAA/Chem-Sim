import { elements, elementPositions } from './elements.js';

// DOM elements
const periodicTable = document.getElementById('periodic-table');
const elementDetails = document.getElementById('element-details');
const detailsCloseBtn = document.querySelector('.details-close-btn');
const elementSearch = document.getElementById('element-search');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// State
let activeElement = null;
let activeFilter = 'all';

// Initialize the application
function init() {
  createPeriodicTable();
  setupEventListeners();
  checkUserThemePreference();
}

// Create the periodic table layout
function createPeriodicTable() {
  // Clear any existing elements
  periodicTable.innerHTML = '';

  // Create elements
  elements.forEach(element => {
    if (!elementPositions[element.atomicNumber]) return;
    
    const { row, col } = elementPositions[element.atomicNumber];
    
    // Create element card
    const elementCard = document.createElement('div');
    elementCard.className = `element ${element.category}`;
    elementCard.dataset.atomicNumber = element.atomicNumber;
    elementCard.dataset.category = element.category;
    
    // Set grid position
    elementCard.style.gridRow = row;
    elementCard.style.gridColumn = col;
    
    // Fill element content
    elementCard.innerHTML = `
      <div class="element-number">${element.atomicNumber}</div>
      <div class="element-symbol">${element.symbol}</div>
      <div class="element-name">${element.name}</div>
      <div class="element-weight">${element.atomicWeight}</div>
    `;
    
    // Add click event
    elementCard.addEventListener('click', () => showElementDetails(element));
    
    // Add to periodic table
    periodicTable.appendChild(elementCard);
  });
}

// Set up event listeners
function setupEventListeners() {
  // Close details panel
  detailsCloseBtn.addEventListener('click', () => {
    elementDetails.classList.remove('active');
    if (activeElement) {
      document.querySelector(`.element[data-atomic-number="${activeElement.atomicNumber}"]`).classList.remove('active');
      activeElement = null;
    }
  });
  
  // Close details when clicking outside
  elementDetails.addEventListener('click', (e) => {
    if (e.target === elementDetails) {
      elementDetails.classList.remove('active');
      if (activeElement) {
        document.querySelector(`.element[data-atomic-number="${activeElement.atomicNumber}"]`).classList.remove('active');
        activeElement = null;
      }
    }
  });
  
  // Element search
  elementSearch.addEventListener('input', handleSearch);
  
  // Filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterElements(button.dataset.category);
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
  
  // Theme toggle
  themeToggleBtn.addEventListener('click', toggleTheme);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elementDetails.classList.contains('active')) {
      elementDetails.classList.remove('active');
      if (activeElement) {
        document.querySelector(`.element[data-atomic-number="${activeElement.atomicNumber}"]`).classList.remove('active');
        activeElement = null;
      }
    }
  });
}

// Show element details
function showElementDetails(element) {
  activeElement = element;
  
  // Update detail content
  document.getElementById('detail-number').textContent = element.atomicNumber;
  document.getElementById('detail-symbol').textContent = element.symbol;
  document.getElementById('detail-name').textContent = element.name;
  document.getElementById('detail-weight').textContent = element.atomicWeight;
  document.getElementById('detail-category').textContent = formatCategoryName(element.category);
  document.getElementById('detail-mass').textContent = `${element.atomicWeight} u`;
  document.getElementById('detail-electron').textContent = element.electronConfiguration;
  document.getElementById('detail-electronegativity').textContent = element.electronegativity ? `${element.electronegativity}` : 'N/A';
  document.getElementById('detail-density').textContent = `${element.density} g/cm³`;
  document.getElementById('detail-melting').textContent = `${element.meltingPoint}°C`;
  document.getElementById('detail-boiling').textContent = `${element.boilingPoint}°C`;
  document.getElementById('detail-year').textContent = element.discoveryYear;
  document.getElementById('detail-description').textContent = element.description;
  
  // Add category class to element card for color
  const elementCard = document.querySelector('.element-card');
  elementCard.className = `element-card ${element.category}`;
  
  // Show details panel with animation
  elementDetails.classList.add('active');
  
  // Highlight selected element
  document.querySelectorAll('.element.active').forEach(el => el.classList.remove('active'));
  document.querySelector(`.element[data-atomic-number="${element.atomicNumber}"]`).classList.add('active');
}

// Handle element search
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  
  document.querySelectorAll('.element').forEach(element => {
    const elementNumber = element.dataset.atomicNumber;
    const elementData = elements.find(e => e.atomicNumber === parseInt(elementNumber));
    
    if (!elementData) return;
    
    const name = elementData.name.toLowerCase();
    const symbol = elementData.symbol.toLowerCase();
    const number = elementData.atomicNumber.toString();
    
    // Check if element matches search and filter
    const matchesSearch = name.includes(searchTerm) || symbol.includes(searchTerm) || number.includes(searchTerm);
    const matchesFilter = activeFilter === 'all' || elementData.category === activeFilter;
    
    element.classList.toggle('hidden', !(matchesSearch && matchesFilter));
  });
}

// Filter elements by category
function filterElements(category) {
  activeFilter = category;
  
  document.querySelectorAll('.element').forEach(element => {
    const elementCategory = element.dataset.category;
    const isVisible = category === 'all' || elementCategory === category;
    
    element.classList.toggle('hidden', !isVisible);
  });
}

// Format category name for display
function formatCategoryName(category) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Theme management
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
}

function checkUserThemePreference() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('darkMode');
  
  if (savedTheme === 'true') {
    document.body.classList.add('dark-mode');
  } else if (savedTheme === 'false') {
    document.body.classList.remove('dark-mode');
  } else {
    // If no saved preference, check system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('dark-mode', prefersDarkMode);
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);