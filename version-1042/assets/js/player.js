function setupPlayer(playUrl) {
  var video = document.getElementById("movie-player");
  var cover = document.getElementById("player-cover");
  var shell = document.getElementById("player-shell");
  var loaded = false;

  if (!video || !cover || !shell) {
    return;
  }

  function bindMedia() {
    if (loaded) {
      return;
    }
    loaded = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = playUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(playUrl);
      hls.attachMedia(video);
    } else {
      video.src = playUrl;
    }
  }

  function begin() {
    bindMedia();
    cover.classList.add("hidden");
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  cover.addEventListener("click", begin);
  shell.addEventListener("click", function (event) {
    if (!loaded && event.target !== video) {
      begin();
    }
  });
  video.addEventListener("play", function () {
    cover.classList.add("hidden");
  });
}
