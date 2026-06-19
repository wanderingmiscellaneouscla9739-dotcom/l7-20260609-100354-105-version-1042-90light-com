var hlsScriptPromise = null;

function loadHlsScript() {
  if (window.Hls) {
    return Promise.resolve(window.Hls);
  }
  if (hlsScriptPromise) {
    return hlsScriptPromise;
  }
  hlsScriptPromise = new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js';
    script.async = true;
    script.onload = function () {
      resolve(window.Hls);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return hlsScriptPromise;
}

export function bindPlayer(streamUrl) {
  var video = document.querySelector('[data-video]');
  var shell = document.querySelector('[data-player-shell]');
  var startButtons = Array.prototype.slice.call(document.querySelectorAll('[data-player-start]'));
  var activeHls = null;
  var loaded = false;

  if (!video || !shell || !streamUrl) {
    return;
  }

  function markPlaying() {
    shell.classList.add('is-playing');
  }

  function markPaused() {
    if (video.paused) {
      shell.classList.remove('is-playing');
    }
  }

  function attachNative() {
    video.src = streamUrl;
    loaded = true;
  }

  function attachHls() {
    return loadHlsScript().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        activeHls = new Hls({ enableWorker: true, lowLatencyMode: true });
        activeHls.loadSource(streamUrl);
        activeHls.attachMedia(video);
        loaded = true;
      } else {
        attachNative();
      }
    }).catch(function () {
      attachNative();
    });
  }

  function ensureStream() {
    if (loaded) {
      return Promise.resolve();
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      attachNative();
      return Promise.resolve();
    }
    return attachHls();
  }

  function play() {
    return ensureStream().then(function () {
      markPlaying();
      return video.play();
    }).catch(function () {
      shell.classList.remove('is-playing');
    });
  }

  startButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      play();
    });
  });

  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    } else {
      video.pause();
    }
  });

  video.addEventListener('play', markPlaying);
  video.addEventListener('pause', markPaused);
  video.addEventListener('ended', markPaused);

  window.addEventListener('beforeunload', function () {
    if (activeHls && activeHls.destroy) {
      activeHls.destroy();
    }
  });
}
