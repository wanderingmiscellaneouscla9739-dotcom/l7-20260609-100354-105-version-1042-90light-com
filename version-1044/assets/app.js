(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initFilters() {
    var scope = document.querySelector("[data-filter-scope]");
    var list = document.querySelector("[data-card-list]");
    if (!scope || !list) {
      return;
    }
    var input = scope.querySelector("[data-filter-input]");
    var year = scope.querySelector("[data-year-filter]");
    var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

    function normalize(value) {
      return String(value || "").toLowerCase().replace(/\s+/g, "");
    }

    function apply() {
      var q = normalize(input ? input.value : "");
      var y = year ? year.value : "";
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-category"),
          card.getAttribute("data-year")
        ].join(" "));
        var cardYear = card.getAttribute("data-year") || "";
        var matchedText = !q || haystack.indexOf(q) !== -1;
        var matchedYear = !y || cardYear === y;
        card.classList.toggle("is-filter-hidden", !(matchedText && matchedYear));
      });
    }

    if (input) {
      input.addEventListener("input", apply);
    }
    if (year) {
      year.addEventListener("change", apply);
    }
    apply();
  }

  function initPlayer() {
    var video = document.getElementById("movie-player");
    if (!video) {
      return;
    }
    var source = video.getAttribute("data-src");
    var button = document.querySelector("[data-play]");
    var attached = false;

    function attach() {
      if (!source || attached) {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        attached = true;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        attached = true;
        return;
      }
      video.src = source;
      attached = true;
    }

    attach();
    if (button) {
      button.addEventListener("click", function () {
        attach();
        button.classList.add("is-hidden");
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            button.classList.remove("is-hidden");
          });
        }
      });
    }
    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayer();
  });
})();
