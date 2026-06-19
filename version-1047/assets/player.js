(function () {
  function initMoviePlayer(config) {
    var video = document.querySelector(config.selector);
    var overlay = document.querySelector(config.overlaySelector);
    var source = config.source;
    var attached = false;
    var hls = null;

    if (!video || !source) {
      return;
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add("hidden-player-overlay");
      }
    }

    function playVideo() {
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {
          window.setTimeout(function () {
            video.play().catch(function () {});
          }, 700);
        });
      }
    }

    function attachSource() {
      if (attached) {
        playVideo();
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl") || video.canPlayType("application/x-mpegURL")) {
        video.src = source;
        video.load();
        playVideo();
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          maxBufferLength: 45,
          maxMaxBufferLength: 90,
          enableWorker: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        if (window.Hls.Events && window.Hls.Events.MANIFEST_PARSED) {
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            playVideo();
          });
        } else {
          playVideo();
        }
        return;
      }
      video.src = source;
      video.load();
      playVideo();
    }

    function start(event) {
      if (event) {
        event.preventDefault();
      }
      hideOverlay();
      attachSource();
    }

    if (overlay) {
      overlay.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener("play", hideOverlay);
    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
