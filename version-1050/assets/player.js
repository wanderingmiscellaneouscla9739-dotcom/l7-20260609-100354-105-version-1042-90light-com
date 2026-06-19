(function () {
  function setupPlayer(source, elementId) {
    var root = document.getElementById(elementId);
    if (!root) {
      return;
    }

    var video = root.querySelector("video");
    var overlay = root.querySelector(".player-overlay");
    var button = root.querySelector(".play-button");
    var isReady = false;
    var hls = null;

    function attachSource() {
      if (isReady) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }

      isReady = true;
    }

    function startPlayback(event) {
      if (event) {
        event.preventDefault();
      }

      attachSource();
      video.controls = true;

      if (overlay) {
        overlay.classList.add("is-hidden");
      }

      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", startPlayback);
    }

    if (button) {
      button.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener("ended", function () {
      if (overlay) {
        overlay.classList.remove("is-hidden");
      }
    });
  }

  window.setupPlayer = setupPlayer;
})();
