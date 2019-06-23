(function (global) {

    class Audio {
        constructor(volume = 100) {
            this.element = this._createElement();
            this.volume = volume;
        }
        _createElement() {
            const element = document.createElement('audio');
            element.setAttribute('autoplay', 'autoplay');
            element.setAttribute('loop', 'loop');
            element.style.display = 'none';
            document.body.appendChild(element);
            return element;
        }
        play(url) {
            this._play(url, false);
        }
        playRepeat(url) {
            this._play(url, true);
        }
        pause() {
            this.element.pause();
        }
        stop() {
            this.element.removeAttribute('loop');
            this.element.pause();
        }
        _play(url, loop) {
            if (!this.volume) return;

            if (global.API && global.API.audio) {
                global.API.audio(url);
                return;
            }

            if (loop) {
                this.element.setAttribute('loop', 'loop');
            } else {
                this.element.removeAttribute('loop');
            }

            if (url) {
                this.element.setAttribute('src', url);
            }

            this.element.play();
        }
        setVolume(value = 1) {
            this.element.volume = value;
        }
    }

    module.exports = Audio;
})(this);