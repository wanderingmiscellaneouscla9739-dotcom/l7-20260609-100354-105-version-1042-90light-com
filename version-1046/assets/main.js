(function() {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function() {
      var open = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '×' : '☰';
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var prev = document.querySelector('.hero-prev');
  var next = document.querySelector('.hero-next');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function restartTimer() {
    if (!slides.length) {
      return;
    }
    window.clearInterval(timer);
    timer = window.setInterval(function() {
      showSlide(current + 1);
    }, 5200);
  }

  if (slides.length) {
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        showSlide(i);
        restartTimer();
      });
    });
    if (prev) {
      prev.addEventListener('click', function() {
        showSlide(current - 1);
        restartTimer();
      });
    }
    if (next) {
      next.addEventListener('click', function() {
        showSlide(current + 1);
        restartTimer();
      });
    }
    restartTimer();
  }

  var search = document.getElementById('site-search');
  var typeFilter = document.getElementById('type-filter');
  var regionFilter = document.getElementById('region-filter');
  var categoryFilter = document.getElementById('category-filter');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-index-card]'));

  function filterCards() {
    var query = search ? search.value.trim().toLowerCase() : '';
    var typeValue = typeFilter ? typeFilter.value : '';
    var regionValue = regionFilter ? regionFilter.value : '';
    var categoryValue = categoryFilter ? categoryFilter.value : '';
    cards.forEach(function(card) {
      var textMatch = !query || (card.getAttribute('data-search') || '').indexOf(query) !== -1;
      var typeMatch = !typeValue || card.getAttribute('data-type') === typeValue;
      var regionMatch = !regionValue || card.getAttribute('data-region') === regionValue;
      var categoryMatch = !categoryValue || card.getAttribute('data-category') === categoryValue;
      card.style.display = textMatch && typeMatch && regionMatch && categoryMatch ? '' : 'none';
    });
  }

  [search, typeFilter, regionFilter, categoryFilter].forEach(function(input) {
    if (input) {
      input.addEventListener('input', filterCards);
      input.addEventListener('change', filterCards);
    }
  });
})();
