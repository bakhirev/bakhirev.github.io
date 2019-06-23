(function () {

    class GamePlayer {
        constructor(elements) { // damage
            this.elements = elements;
            this.health = 100;
            this._time = 0;
            this._limit = 1000;
            this._cache = null;
            this._state = false;
        }

        step(timeShift, code, samosborDistance) {
            this._time += timeShift;
            if (this._time >= this._limit) {
                this._time = this._time - this._limit;
                this._update(code, samosborDistance);
            }
        }

        _update(code, samosborDistance) {
            if (code === 21) this.addDamage(5);
            if (samosborDistance < 2) this.addDamage(15);
            else if (samosborDistance < 4) this.addDamage(10);
            else if (samosborDistance < 10) this.addDamage(5);
        }

        addDamage(damage) {
            this.health -= damage;
            if (this.health < 0) this.health = 0;
            this._showDamage();
        }


        _showDamage() {
            this._state = !this._state;
            this.elements.damage.className = this._state ? 'damage_screen_a' : 'damage_screen_b';
        }

        render() {
            if (!this.elements.health || this._cache === this.health) return;
            this._cache = this.health;
            this.elements.health.innerHTML = this.health;
        }

        save() {
            return {
                time: this._time,
                health: this.health,
                state: this._state,
            }
        }

        load(data) {
            this.health = data.health;
            this._time = data.time;
            this._state = data.state;
            this._cache = null;
        }
    }

    module.exports = GamePlayer;
})();
