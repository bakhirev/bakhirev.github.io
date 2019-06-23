(function () {

    const dom_events = require('dom_events');

    class Joystick {
        constructor(elements) {
            this.elements = elements;
            this.correctCodes = [65, 68, 83, 87 ,37, 38, 39, 40];
            this.keyBuffer = [];
            this._prevX = 0;
            this._deltaRotate = 0;

            this._onMouseMove = this._onMouseMove.bind(this);
            this._onMouseOver = this._onMouseOver.bind(this);
            this._onMouseDown = this._onMouseDown.bind(this);
            this._onKeyDown = this._onKeyDown.bind(this);
            this._onKeyUp = this._onKeyUp.bind(this);
            this._setEvents();
        }

        _setEvents() {
            // this.elements.display.addEventListener('mousemove', this._onMouseMove, false);
            // this.elements.display.addEventListener('mouseover', this._onMouseOver, false);
            // this.elements.display.addEventListener('mousedown', this._onMouseDown, false);
            document.body.addEventListener('keydown', this._onKeyDown, false);
            document.body.addEventListener('keyup', this._onKeyUp, false);
        }

        _onMouseMove(event) {
            const speed = 9;
            const dx = (this._prevX - event.clientX) * speed;
            this._prevX = event.clientX;
            this._deltaRotate += 0.01 * Math.sign(dx) * speed;
        }

        _onMouseOver() {
            this._prevX = 0;
        }

        getDeltaRotate() {
            const delta = this._deltaRotate;
            this._deltaRotate = 0;
            return delta;
        }

        _onMouseDown(event) {
            dom_events.stopEvent(event);
            const code = event.keyCode;
            this.elements.input.focus();
            return false;
        }

        _onKeyDown(event) {
            const code = event.keyCode;
            if (this.correctCodes.indexOf(code) !== -1
                && this.keyBuffer.indexOf(code) === -1) this.keyBuffer.push(code);
        }

        _onKeyUp(event) {
            const code = event.keyCode;
            if (this.correctCodes.indexOf(code) === -1) return;
            const index = this.keyBuffer.indexOf(code);
            if (index !== -1) this.keyBuffer.splice(index, 1);
        }

        getDeltaPosition(cameraPosition, speed) {
            if (!this.keyBuffer.length) return { dx: 0, dz: 0 };
            const [minMaxSin, minMaxCos] = this._getMinAndMaxSinAndCos(cameraPosition);
            return {
                dx: speed * (minMaxSin[1] + minMaxSin[0]) * (-1),
                dz: speed * (minMaxCos[1] + minMaxCos[0]) * (-1)
            };
        }

        _getMinAndMaxSinAndCos(cameraPosition) {
            let minMaxSin = [0, 0];
            let minMaxCos = [0, 0];

            this.keyBuffer.forEach(code => {
                const angle = this._getAngle(code, cameraPosition);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                if (code === 37 || code === 39 || code === 65 || code === 68) {
                    const speed = 9;
                    const direction = (code === 37 || code === 65) ? 1 : -1;
                    this._deltaRotate += 0.01 * direction * speed;
                    return;
                }

                if (sin > 0) {
                    minMaxSin[1] = Math.max(sin, minMaxSin[1]);
                } else {
                    minMaxSin[0] = Math.min(sin, minMaxSin[0]);
                }

                if (cos > 0) {
                    minMaxCos[1] = Math.max(cos, minMaxCos[1]);
                } else {
                    minMaxCos[0] = Math.min(cos, minMaxCos[0]);
                }
            });

            return [minMaxSin, minMaxCos];
        }

        _getAngle(code, cameraPosition) {
            if (code === 87 || code === 38) return cameraPosition.rotate[1];
            if (code === 83 || code === 40) return cameraPosition.rotate[1] + Math.PI;
            if (code === 65) return cameraPosition.rotate[1] + (Math.PI / 2);
            if (code === 68) return cameraPosition.rotate[1] + (Math.PI / 2) + Math.PI;
            return 0;
        }
    }

    module.exports = Joystick;
})();
