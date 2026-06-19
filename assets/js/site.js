(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("open");
      });
    }

    document.querySelectorAll("[data-site-search]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector('input[name="q"]');
        if (!input || input.value.trim()) {
          return;
        }
        event.preventDefault();
        input.focus();
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function showSlide(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === current);
        });
      }

      function startTimer() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          showSlide(current + 1);
        }, 5200);
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          showSlide(index);
          startTimer();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          showSlide(current - 1);
          startTimer();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          showSlide(current + 1);
          startTimer();
        });
      }

      showSlide(0);
      startTimer();
    }

    var filterRoot = document.querySelector("[data-filterable]");
    var filterInput = document.querySelector("[data-filter-input]");
    var filterYear = document.querySelector("[data-filter-year]");
    var filterType = document.querySelector("[data-filter-type]");
    var filterCategory = document.querySelector("[data-filter-category]");

    if (filterRoot && filterInput) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q") || "";
      filterInput.value = q;

      function applyFilters() {
        var keyword = filterInput.value.trim().toLowerCase();
        var year = filterYear ? filterYear.value : "";
        var type = filterType ? filterType.value : "";
        var category = filterCategory ? filterCategory.value : "";
        var items = filterRoot.querySelectorAll(".movie-card, .ranking-card");

        items.forEach(function (item) {
          var search = (item.getAttribute("data-search") || "").toLowerCase();
          var itemYear = item.getAttribute("data-year") || "";
          var itemType = item.getAttribute("data-type") || "";
          var itemCategory = item.getAttribute("data-category") || "";
          var matched = true;

          if (keyword && search.indexOf(keyword) === -1) {
            matched = false;
          }

          if (year && itemYear !== year) {
            matched = false;
          }

          if (type && itemType !== type) {
            matched = false;
          }

          if (category && itemCategory !== category) {
            matched = false;
          }

          if (matched) {
            item.removeAttribute("hidden-by-filter");
          } else {
            item.setAttribute("hidden-by-filter", "true");
          }
        });
      }

      [filterInput, filterYear, filterType, filterCategory].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilters);
          control.addEventListener("change", applyFilters);
        }
      });

      applyFilters();
    }
  });
})();
