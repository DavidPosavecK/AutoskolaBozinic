document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const body = document.body;

  function toggleMenu() {
    const isOpen = navLinks.classList.contains('open');
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    
    // Prevent body scroll when menu is open (mobile only)
    if (window.innerWidth <= 768) {
      if (!isOpen) {
        body.classList.add('menu-open');
      } else {
        body.classList.remove('menu-open');
      }
    }
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    body.classList.remove('menu-open');
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking on a link
    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && 
          !hamburger.contains(e.target) && 
          !navLinks.contains(e.target)) {
        closeMenu();
      }
    });

    // Close menu on window resize if it becomes desktop view
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
        closeMenu();
      }
    });
  }
});