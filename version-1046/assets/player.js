function bindMoviePlayer(videoId, sourceUrl, overlayId) {
  var video = document.getElementById(videoId);
  var overlay = document.getElementById(overlayId);
  var loaded = false;
  var hls = null;

  if (!video || !overlay || !sourceUrl) {
    return;
  }

  function attachSource() {
    if (loaded) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
    } else {
      video.src = sourceUrl;
    }
    loaded = true;
  }

  function startPlayback() {
    attachSource();
    overlay.classList.add('is-hidden');
    video.controls = true;
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function() {});
    }
  }

  overlay.addEventListener('click', startPlayback);
  video.addEventListener('click', function() {
    if (video.paused) {
      startPlayback();
    } else {
      video.pause();
    }
  });
  window.addEventListener('pagehide', function() {
    if (hls) {
      hls.destroy();
    }
  });
}
