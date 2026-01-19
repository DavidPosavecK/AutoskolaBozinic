// Timeline steps - no JavaScript needed, all content is visible
document.addEventListener('DOMContentLoaded', function() {
  // Add smooth scroll for better UX if needed
  const stepItems = document.querySelectorAll('.step-item');
  
  stepItems.forEach(item => {
    item.addEventListener('click', () => {
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
});

