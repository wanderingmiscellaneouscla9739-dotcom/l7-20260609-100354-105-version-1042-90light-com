(function () {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function one(selector, root) {
    return (root || document).querySelector(selector);
  }

  function initMobileMenu() {
    var toggle = one('[data-mobile-toggle]');
    var panel = one('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function initSearchForms() {
    all('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = one('input[name="q"]', form);
        var query = input ? input.value.trim() : '';
        if (query) {
          window.location.href = './search.html?q=' + encodeURIComponent(query);
        }
      });
    });
  }

  function initHero() {
    var hero = one('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = all('.hero-slide', hero);
    var dots = all('[data-hero-dot]', hero);
    var prev = one('[data-hero-prev]', hero);
    var next = one('[data-hero-next]', hero);
    var index = 0;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5600);
  }

  function initFilters() {
    var list = one('[data-filter-list]');
    if (!list) {
      return;
    }
    var search = one('[data-filter-search]');
    var year = one('[data-filter-year]');
    var cards = all('[data-movie-card]', list);

    function apply() {
      var term = search ? search.value.trim().toLowerCase() : '';
      var selectedYear = year ? year.value : '';
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var matched = (!term || text.indexOf(term) !== -1) && (!selectedYear || cardYear === selectedYear);
        card.style.display = matched ? '' : 'none';
      });
    }

    if (search) {
      search.addEventListener('input', apply);
    }
    if (year) {
      year.addEventListener('change', apply);
    }
  }

  function initSearchPage() {
    var page = one('[data-search-page]');
    if (!page || !window.SEARCH_DATA) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var input = one('.large-search input[name="q"]', page);
    var title = one('[data-search-title]', page);
    var results = one('[data-search-results]', page);
    if (input) {
      input.value = query;
    }
    if (!query) {
      return;
    }
    var words = query.toLowerCase().split(/\s+/).filter(Boolean);
    var matches = window.SEARCH_DATA.filter(function (item) {
      var haystack = [item.title, item.year, item.region, item.type, item.genre, item.category, item.tags, item.summary].join(' ').toLowerCase();
      return words.every(function (word) {
        return haystack.indexOf(word) !== -1;
      });
    }).slice(0, 240);
    if (title) {
      title.textContent = matches.length ? '搜索结果：' + query : '未找到相关内容：' + query;
    }
    if (!results) {
      return;
    }
    results.innerHTML = '';
    matches.forEach(function (item) {
      var link = document.createElement('a');
      link.className = 'movie-card compact';
      link.href = item.href;

      var poster = document.createElement('span');
      poster.className = 'poster-frame';
      var img = document.createElement('img');
      img.src = item.cover;
      img.alt = item.title;
      img.loading = 'lazy';
      var year = document.createElement('em');
      year.textContent = item.year;
      poster.appendChild(img);
      poster.appendChild(year);

      var info = document.createElement('span');
      info.className = 'movie-info';
      var strong = document.createElement('strong');
      strong.textContent = item.title;
      var small = document.createElement('small');
      small.textContent = item.region + ' · ' + item.type + ' · ' + item.genre;
      var desc = document.createElement('span');
      desc.className = 'card-desc';
      desc.textContent = item.summary;
      info.appendChild(strong);
      info.appendChild(small);
      info.appendChild(desc);

      link.appendChild(poster);
      link.appendChild(info);
      results.appendChild(link);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initSearchForms();
    initHero();
    initFilters();
    initSearchPage();
  });
})();
