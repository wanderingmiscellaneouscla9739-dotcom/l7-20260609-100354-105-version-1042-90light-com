(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var toggle = qs('[data-menu-toggle]');
    var menu = qs('[data-mobile-menu]');
    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    qsa('[data-hero]').forEach(function (hero) {
        var slides = qsa('[data-hero-slide]', hero);
        var dots = qsa('[data-hero-dot]', hero);
        var previous = qs('[data-hero-prev]', hero);
        var next = qs('[data-hero-next]', hero);
        var active = 0;
        var timer;

        function show(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle('is-active', itemIndex === active);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle('is-active', itemIndex === active);
            });
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5000);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                restart();
            });
        });

        if (previous) {
            previous.addEventListener('click', function () {
                show(active - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(active + 1);
                restart();
            });
        }

        restart();
    });

    qsa('[data-filter-input]').forEach(function (input) {
        var cards = qsa('[data-search-item]');
        var empty = qs('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q');

        if (initial) {
            input.value = initial;
        }

        function filterCards() {
            var keyword = input.value.trim().toLowerCase();
            var visible = 0;
            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                var matched = !keyword || text.indexOf(keyword) !== -1;
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        input.addEventListener('input', filterCards);
        filterCards();
    });

    var searchInput = qs('[data-global-search]');
    var searchPanel = qs('[data-search-panel]');
    var searchForm = qs('[data-global-search-form]');

    function closePanel() {
        if (searchPanel) {
            searchPanel.classList.remove('is-open');
            searchPanel.innerHTML = '';
        }
    }

    if (searchInput && searchPanel && window.siteMovies) {
        searchInput.addEventListener('input', function () {
            var keyword = searchInput.value.trim().toLowerCase();
            if (!keyword) {
                closePanel();
                return;
            }

            var results = window.siteMovies.filter(function (movie) {
                return movie.s.indexOf(keyword) !== -1;
            }).slice(0, 8);

            if (!results.length) {
                searchPanel.innerHTML = '<span class="search-empty">没有找到匹配影片</span>';
                searchPanel.classList.add('is-open');
                return;
            }

            searchPanel.innerHTML = results.map(function (movie) {
                return '<a href="' + movie.u + '"><strong>' + movie.t + '</strong><br><small>' + movie.m + '</small></a>';
            }).join('');
            searchPanel.classList.add('is-open');
        });

        document.addEventListener('click', function (event) {
            if (!searchPanel.contains(event.target) && event.target !== searchInput) {
                closePanel();
            }
        });
    }

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function (event) {
            var keyword = searchInput.value.trim();
            if (!keyword) {
                event.preventDefault();
                window.location.href = './library.html';
            }
        });
    }
})();
