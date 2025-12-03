// Card filtering functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add data-category attributes to all cards based on their badge class
  const allCards = document.querySelectorAll('.product-card');
  allCards.forEach(card => {
    const badge = card.querySelector('.badge');
    if (badge) {
      if (badge.classList.contains('marketing-badge')) {
        card.setAttribute('data-category', 'marketing');
      } else if (badge.classList.contains('management-badge')) {
        card.setAttribute('data-category', 'management');
      } else if (badge.classList.contains('hr-badge')) {
        card.setAttribute('data-category', 'hr');
      } else if (badge.classList.contains('design-badge')) {
        card.setAttribute('data-category', 'design');
      } else if (badge.classList.contains('development-badge')) {
        card.setAttribute('data-category', 'development');
      }
    }
  });

  // Shuffle the order of all cards
  shuffleCards();

  // Get all elements
  const tabButtons = document.querySelectorAll('.tab-button');
  const searchInput = document.getElementById('search-input');

  // Move all cards from hidden tabs to the main "all" tab container
  const mainContainer = document.querySelector('#all .products-grid');
  const hiddenTabs = document.querySelectorAll('.tab-content:not(#all)');

  hiddenTabs.forEach(tab => {
    const cards = tab.querySelectorAll('.product-card');
    cards.forEach(card => {
      mainContainer.appendChild(card);
    });
  });

  // Hide the hidden tab containers completely
  hiddenTabs.forEach(tab => {
    tab.style.display = 'none';
  });

  // Set active tab to "All" by default
  setActiveTab('all');

  // Function to set active tab
  function setActiveTab(category) {
    tabButtons.forEach(button => {
      button.classList.remove('active');
      if (button.getAttribute('data-tab') === category) {
        button.classList.add('active');
      }
    });
  }

  // Function to filter cards
  function filterCards(category, searchTerm = '') {
    const allCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;

    allCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || 'all';
      const cardTitle = card.querySelector('h3').textContent.toLowerCase();
      const speakerName = card.querySelector('.speaker').textContent.toLowerCase();

      const matchesCategory = category === 'all' || cardCategory === category;
      const matchesSearch = !searchTerm ||
                           cardTitle.includes(searchTerm.toLowerCase()) ||
                           speakerName.includes(searchTerm.toLowerCase());

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex'; // Show card
        visibleCount++;
      } else {
        card.style.display = 'none'; // Hide card
      }
    });

    // Show or hide the "no cards" message
    showNoCardsMessage(visibleCount === 0);
  }

  // Function to show/hide "no cards" message
  function showNoCardsMessage(show) {
    // Find the products grid container
    const productsGrid = document.querySelector('#all .products-grid');

    // Find the pagination/load more element
    const paginationElement = document.querySelector('.pagination');

    if (!productsGrid) return; // If we don't have the products grid, exit

    let noCardsMessage = document.getElementById('no-cards-message');

    if (show) {
      if (!noCardsMessage) {
        // Create the message element if it doesn't exist
        noCardsMessage = document.createElement('div');
        noCardsMessage.id = 'no-cards-message';
        noCardsMessage.className = 'no-cards-message';
        noCardsMessage.textContent = 'Нет подходящих карточек';

        // Add some basic styling
        noCardsMessage.style.cssText = `
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px 20px;
          font-size: 18px;
          color: #666;
          font-weight: 400;
        `;

        // Insert into the products grid container
        productsGrid.appendChild(noCardsMessage);
      } else {
        noCardsMessage.style.display = 'block';
      }

      // Hide the pagination/load more element when no cards are found
      if (paginationElement) {
        paginationElement.style.display = 'none';
      }
    } else {
      if (noCardsMessage) {
        noCardsMessage.style.display = 'none';
      }

      // Show the pagination/load more element when cards are found
      if (paginationElement) {
        paginationElement.style.display = 'flex';
      }
    }
  }

  // Tab button event listeners
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.getAttribute('data-tab');
      setActiveTab(category);
      filterCards(category, searchInput.value);
    });
  });

  // Search input event listener
  searchInput.addEventListener('input', function() {
    const activeTab = document.querySelector('.tab-button.active').getAttribute('data-tab');
    filterCards(activeTab, this.value);
  });

  // Initialize: Show all cards by default
  filterCards('all');

  // Update tab counts after cards are processed
  updateTabCounts();

  // Hide "no cards" message on initialization since we're showing all cards
  showNoCardsMessage(false);

  // Function to shuffle cards
  function shuffleCards() {
    const container = document.querySelector('.products-grid');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.product-card'));

    // Fisher-Yates shuffle algorithm
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements
      container.insertBefore(cards[j], cards[i].nextSibling);
    }
  }

  // Function to count cards by category and update tab counts
  function updateTabCounts() {
    const allCards = document.querySelectorAll('.product-card');
    const categoryCounts = {
      'all': allCards.length,
      'marketing': 0,
      'management': 0,
      'hr': 0,
      'design': 0,
      'development': 0
    };

    allCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (category && categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      }
    });

    // Update the tab count elements
    Object.keys(categoryCounts).forEach(category => {
      const tabButton = document.querySelector(`.tab-button[data-tab="${category}"] .tab-count`);
      if (tabButton) {
        tabButton.textContent = categoryCounts[category];
      }
    });
  }
});