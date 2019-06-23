(function () {

    const is = require('is');

    const methods = {
        _wheelEventName: null,
        getFixedEventName(element, eventName) {
            if (eventName === 'wheel') {
                if (!this._wheelEventName) {
                    this._setWheelEventName(element, eventName);
                }
                return this._wheelEventName;
            }

            return {
                'true': {
                    'mousedown': 'touchstart',
                    'mouseup': 'touchend',
                    'mouseout': 'touchend',
                    'mousemove': 'touchend'
                },
                'false': {}
            }[is.mobile][eventName] || eventName;
        },
        _setWheelEventName(element, eventName) {
            let name = eventName;
            if (element.addEventListener) {
                if ('onwheel' in document) {
                    name = 'wheel'; // Other;
                } else if ('onmousewheel' in document) {
                    name = 'mousewheel'; // old;
                } else {
                    name = 'MozMousePixelScroll'; // FF17;
                }
            } else {
                name = 'onmousewheel'; // IE8;
            }
            this._wheelEventName = name;
        },
    };

    module.domEventsName = methods;
})();