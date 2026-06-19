(function () {
  var toggle = document.querySelector(".menu-toggle");
  var panel = document.querySelector("[data-mobile-panel]");

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var opened = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function createCard(item) {
    var tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");

    return "" +
      "<article class=\"movie-card\">" +
      "<a class=\"poster-link\" href=\"" + item.url + "\" aria-label=\"观看 " + escapeHtml(item.title) + "\">" +
      "<img src=\"" + item.cover + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\">" +
      "<span class=\"poster-shade\"></span>" +
      "<span class=\"play-icon\">▶</span>" +
      "<span class=\"duration\">" + escapeHtml(item.duration) + "</span>" +
      "</a>" +
      "<div class=\"movie-card-body\">" +
      "<h2><a href=\"" + item.url + "\">" + escapeHtml(item.title) + "</a></h2>" +
      "<p>" + escapeHtml(item.description) + "</p>" +
      "<div class=\"movie-meta\"><span>" + escapeHtml(item.year) + "</span><span>" + escapeHtml(item.region) + "</span><a href=\"./category-" + item.categorySlug + ".html\">" + escapeHtml(item.categoryName) + "</a></div>" +
      "<div class=\"tag-row\">" + tags + "</div>" +
      "</div>" +
      "</article>";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  var searchRoot = document.querySelector("[data-search-page]");
  if (!searchRoot || !window.movieIndex) {
    return;
  }

  var form = searchRoot.querySelector("[data-search-form]");
  var input = searchRoot.querySelector("[data-search-input]");
  var category = searchRoot.querySelector("[data-search-category]");
  var region = searchRoot.querySelector("[data-search-region]");
  var results = searchRoot.querySelector("[data-search-results]");
  var empty = searchRoot.querySelector("[data-search-empty]");
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get("q") || "";

  input.value = initialQuery;

  function render() {
    var q = normalize(input.value);
    var cat = normalize(category.value);
    var reg = normalize(region.value);
    var matches = window.movieIndex.filter(function (item) {
      var text = normalize([
        item.title,
        item.description,
        item.year,
        item.region,
        item.type,
        item.genre,
        item.categoryName,
        (item.tags || []).join(" ")
      ].join(" "));
      var queryOk = !q || text.indexOf(q) !== -1;
      var categoryOk = !cat || normalize(item.categorySlug) === cat;
      var regionOk = !reg || normalize(item.region).indexOf(reg) !== -1;
      return queryOk && categoryOk && regionOk;
    }).slice(0, 120);

    results.innerHTML = matches.map(createCard).join("");
    empty.style.display = matches.length ? "none" : "block";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    render();
  });

  input.addEventListener("input", render);
  category.addEventListener("change", render);
  region.addEventListener("change", render);
  render();
})();
