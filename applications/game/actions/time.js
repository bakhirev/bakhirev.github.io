(function () {

    class GameTime {
        constructor(element) {
            this.element = element;
            this._limit = 1000;
            this._time = 0;
            this._cache = 0;
            this.total = 0;
        }

        step(timeShift) {
            this._time += timeShift;
            if (this._time >= this._limit) {
                this.total += this._limit;
                this._time = this._time - this._limit;
            }
        }

        getTimeShift(code, timeShift) {
            if (code === 20) return 4 * timeShift;
            return timeShift;
        }

        render() {
            const timeInSeconds = Math.floor(this.total / 1000);
            if (!this.element || this._cache === timeInSeconds) return;

            this._cache = timeInSeconds;
            let minutes = Math.floor(timeInSeconds / 60);
            let seconds = timeInSeconds - minutes * 60;
            if (minutes < 10) minutes = `0${minutes}`;
            if (seconds < 10) seconds = `0${seconds}`;
            this.element.innerHTML = `${minutes}:${seconds}`;
        }

        save() {
            return {
                time: this._time,
                total: this.total,
            }
        }

        load(data) {
            this._time = data.time;
            this.total = data.total;
            this._cache = 0;
        }
    }

    module.exports = GameTime;
})();
