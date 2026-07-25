document.addEventListener('DOMContentLoaded', function() {
  renderHeader();
  renderFooter();
  observeReveal(document.querySelectorAll('.scroll-reveal'));

  // Accordion toggle
  document.querySelectorAll('.faq-question').forEach(function(q) {
    q.addEventListener('click', function() {
      var item = this.parentElement;
      var answer = this.nextElementSibling;

      item.classList.toggle('active');

      if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
        answer.style.maxHeight = '0px';
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});
