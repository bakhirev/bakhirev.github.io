(function () {

    const Audio = require('Audio');

    class GameAudio {
        constructor() {
            this._time = 0;
            this._limit = 1000;
            this._cache = null;

            this._setWorkFlow();
        }

        _setWorkFlow() {
            this._audioBackground = new Audio();
            this._audioActions = new Audio();
            this._audioEvents = new Audio();

            this._audioBackground.setVolume(0.3);
            this._audioActions.setVolume(1);
            this._audioEvents.setVolume(1);
        }

        step(timeShift, code) {
            this._time += timeShift;
            if (this._time >= this._limit) {
                this._time = this._time - this._limit;
                this._update(code);
            }
        }

        playOnce(code) {
            const url = this._getSoundUrl(code);
            this._audioEvents.play(url);
        }

        play(isSamosbor) {
            const path = isSamosbor ? './mp3/alert.mp3' : './mp3/background_1.mp3';
            this._audioBackground.playRepeat(path);
        }

        pause() {
            this._cache = null;
            this._audioBackground.stop();
            this._audioActions.stop();
        }

        _update(code) {
            const url = this._getSoundUrl(code);
            if (this._cache === url) return;
            this._cache = url;
            if (url) {
                this._audioActions.playRepeat(url);
            } else {
                this._audioActions.stop();
            }
        }

        _getSoundUrl(code) {
            if (code === 10) return './mp3/pass.mp3';
            if (code === 20) return './mp3/time.mp3';
            if (code === 21) return './mp3/radiation.mp3';
            if (code === 100) return './mp3/dead.mp3';
            return null;
        }
    }

    module.exports = GameAudio;
})();
