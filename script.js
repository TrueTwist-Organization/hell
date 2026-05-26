document.addEventListener('DOMContentLoaded', () => {
  const openNavBtn = document.getElementById('openNav');
  const closeNavBtn = document.getElementById('closeNav');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const header = document.getElementById('header');

  // Mobile navigation toggle
  function toggleNav() {
    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    
    // Prevent background scrolling when nav is open
    if (mobileNav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  openNavBtn.addEventListener('click', toggleNav);
  closeNavBtn.addEventListener('click', toggleNav);
  mobileOverlay.addEventListener('click', toggleNav);

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = 'var(--shadow-md)';
      header.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
      header.style.boxShadow = 'var(--shadow-sm)';
      header.style.background = 'var(--glass-bg)';
    }
  });

  // Search form submission (prevent default for demo)
  const searchForm = document.querySelector('.search-form');
  if(searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchForm.querySelector('input').value;
      if (query.trim()) {
        alert('Searching for: ' + query);
      }
    });
  }
});
