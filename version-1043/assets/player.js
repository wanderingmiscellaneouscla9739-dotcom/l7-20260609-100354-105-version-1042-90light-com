(function () {
    function setupPlayer(player) {
        var video = player.querySelector('video');
        var cover = player.querySelector('[data-play-cover]');
        var stream = player.getAttribute('data-stream');
        var ready = false;

        if (!video || !cover || !stream) {
            return;
        }

        function loadStream() {
            if (ready) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                ready = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                video._hls = hls;
                ready = true;
                return;
            }

            video.src = stream;
            ready = true;
        }

        function startPlayback() {
            loadStream();
            player.classList.add('is-playing');
            video.setAttribute('controls', 'controls');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        cover.addEventListener('click', startPlayback);
        cover.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                startPlayback();
            }
        });
        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback();
            }
        });
    }

    document.querySelectorAll('[data-player]').forEach(setupPlayer);
})();
