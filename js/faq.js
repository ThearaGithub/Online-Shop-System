document.addEventListener('DOMContentLoaded', function() {
  renderHeader();
  renderFooter();
  observeReveal(document.querySelectorAll('.scroll-reveal'));

  // Accordion toggle: click question to show/hide answer
  document.querySelectorAll('.faq-question').forEach(function(q) {
    q.addEventListener('click', function() {
      var item = this.parentElement;
      var answer = this.nextElementSibling;

      // Toggle active class
      item.classList.toggle('active');

      // Toggle max-height for smooth animation
      if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
        answer.style.maxHeight = '0px';
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});