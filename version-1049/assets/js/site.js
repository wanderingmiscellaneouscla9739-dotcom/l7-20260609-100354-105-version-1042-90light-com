(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initMobileMenu() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function initSearchForms() {
        document.querySelectorAll("[data-search-form]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input");
                var query = input ? input.value.trim() : "";
                var root = form.getAttribute("data-root") || "";
                if (query) {
                    window.location.href = root + "search.html?q=" + encodeURIComponent(query);
                }
            });
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length <= 1) {
            return;
        }
        var current = 0;
        var timer;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                window.clearInterval(timer);
                show(index);
                start();
            });
        });

        show(0);
        start();
    }

    function textIncludes(value, query) {
        return String(value || "").toLowerCase().indexOf(query) !== -1;
    }

    function initFilters() {
        var blocks = document.querySelectorAll("[data-filter-block]");
        blocks.forEach(function (block) {
            var input = block.querySelector("[data-filter-input]");
            var yearSelect = block.querySelector("[data-filter-year]");
            var typeSelect = block.querySelector("[data-filter-type]");
            var regionSelect = block.querySelector("[data-filter-region]");
            var cards = Array.prototype.slice.call(block.querySelectorAll("[data-card]"));
            var empty = block.querySelector("[data-empty]");

            function apply() {
                var query = input ? input.value.trim().toLowerCase() : "";
                var year = yearSelect ? yearSelect.value : "";
                var type = typeSelect ? typeSelect.value : "";
                var region = regionSelect ? regionSelect.value : "";
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-tags"),
                        card.getAttribute("data-genre")
                    ].join(" ").toLowerCase();
                    var ok = true;
                    if (query && !textIncludes(haystack, query)) {
                        ok = false;
                    }
                    if (year && card.getAttribute("data-year") !== year) {
                        ok = false;
                    }
                    if (type && card.getAttribute("data-type") !== type) {
                        ok = false;
                    }
                    if (region && card.getAttribute("data-region") !== region) {
                        ok = false;
                    }
                    card.style.display = ok ? "" : "none";
                    if (ok) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.style.display = visible ? "none" : "block";
                }
            }

            [input, yearSelect, typeSelect, regionSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });

            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q");
            if (initialQuery && input) {
                input.value = initialQuery;
            }
            apply();
        });
    }

    function initPlayers() {
        document.querySelectorAll("[data-player]").forEach(function (shell) {
            var video = shell.querySelector("video");
            var button = shell.querySelector("[data-play-button]");
            if (!video) {
                return;
            }
            var url = video.getAttribute("data-play");
            if (url) {
                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = url;
                }
            }

            function startPlay() {
                if (button) {
                    button.classList.add("is-hidden");
                }
                var action = video.play();
                if (action && typeof action.catch === "function") {
                    action.catch(function () {
                        if (button) {
                            button.classList.remove("is-hidden");
                        }
                    });
                }
            }

            if (button) {
                button.addEventListener("click", startPlay);
            }
            video.addEventListener("click", function () {
                if (video.paused) {
                    startPlay();
                } else {
                    video.pause();
                }
            });
            video.addEventListener("play", function () {
                if (button) {
                    button.classList.add("is-hidden");
                }
            });
            video.addEventListener("pause", function () {
                if (button) {
                    button.classList.remove("is-hidden");
                }
            });
        });
    }

    ready(function () {
        initMobileMenu();
        initSearchForms();
        initHero();
        initFilters();
        initPlayers();
    });
}());
