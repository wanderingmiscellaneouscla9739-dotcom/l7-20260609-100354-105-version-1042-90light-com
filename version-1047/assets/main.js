(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");
    if (menuToggle && mobilePanel) {
      menuToggle.addEventListener("click", function () {
        var open = mobilePanel.classList.toggle("open");
        document.body.classList.toggle("menu-open", open);
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === current);
          dot.setAttribute("aria-current", i === current ? "true" : "false");
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          restart();
        });
      }

      show(0);
      restart();
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-filter-root]")).forEach(function (root) {
      var input = root.querySelector("[data-filter-input]");
      var cards = Array.prototype.slice.call(root.querySelectorAll("[data-card]"));
      var empty = root.querySelector("[data-empty-state]");
      var chips = Array.prototype.slice.call(root.querySelectorAll("[data-filter-tag]"));
      root.setAttribute("data-active-tag", "all");

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var activeTag = root.getAttribute("data-active-tag") || "all";
        var visible = 0;
        cards.forEach(function (card) {
          var text = card.innerText.toLowerCase();
          var cardTags = (card.getAttribute("data-tags") || "").toLowerCase();
          var type = (card.getAttribute("data-type") || "").toLowerCase();
          var region = (card.getAttribute("data-region") || "").toLowerCase();
          var genre = (card.getAttribute("data-genre") || "").toLowerCase();
          var matchesQuery = !query || text.indexOf(query) >= 0;
          var matchesTag = activeTag === "all" || cardTags.indexOf(activeTag) >= 0 || type.indexOf(activeTag) >= 0 || region.indexOf(activeTag) >= 0 || genre.indexOf(activeTag) >= 0;
          var isVisible = matchesQuery && matchesTag;
          card.classList.toggle("is-hidden", !isVisible);
          if (isVisible) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      if (input) {
        input.addEventListener("input", apply);
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          chips.forEach(function (item) {
            item.classList.remove("is-active");
          });
          chip.classList.add("is-active");
          root.setAttribute("data-active-tag", (chip.getAttribute("data-filter-tag") || "all").toLowerCase());
          apply();
        });
      });

      apply();
    });
  });
})();
