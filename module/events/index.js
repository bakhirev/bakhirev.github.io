(function () {

    class EventEmitter {
        constructor() {
            this._callbacks = {};
        }

        destructor() {
            this._callbacks = {};
        }

        on(eventName, callback, context) {
            if (!this._callbacks[eventName]) {
                this._callbacks[eventName] = [];
            }

            if (context) {
                callback = callback.bind(context);
            }

            this._callbacks[eventName].push(callback);
        }

        off(eventName, callback) {
            const callbacks = this._callbacks[eventName];
            for (let i = 0, l = callbacks.length; i < l; i++) {
                if (callbacks[i] !== callback) continue;
                callbacks.splice(i, 1);
                l--;
                i--;
            }
        }

        emit(eventName, data) {
            const callbacks = this._callbacks[eventName];

            if (!callbacks) return;

            for (let i = 0, l = callbacks.length; i < l; i++) {
                callbacks[i](data);
            }
        }
    }

    module.exports = EventEmitter;
})();
