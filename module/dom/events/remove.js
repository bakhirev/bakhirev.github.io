(function () {

    const is = require('is');
    const domEventsName = require('domEventsName');

    const methods = {
        removeEvent(element, eventName, callback) {
            const self = this;

            if (!element || !eventName || !callback) return;

            eventName = domEventsName.getFixedEventName(element, eventName);

            if (is.mobile && eventName === 'click') {
                self._removeEvent(element, 'touchstart', callback);
                self._removeEvent(element, 'touchstart', self.stopEvent);
                self._removeEvent(element, 'touchmove', self.stopEvent);
                self._removeEvent(element, 'touchend', self.stopEvent);
            } else {
                self._removeEvent(element, eventName, callback);
            }
        },
        _removeEvent(element, eventName, callback) {
            const self = this;

            if (element.removeEventListener) {
                self._removeEvent = self._removeEventForOther;
            } else if (element.attachEvent) {
                self._removeEvent = self._removeEventForIe;
            } else {
                return;
            }

            self._removeEvent(element, eventName, callback);
        },
        _removeEventForIe(element, eventName, callback) {
            element.detachEvent('on' + eventName, callback);
        },
        _removeEventForOther(element, eventName, callback) {
            element.removeEventListener(eventName, callback);
        }
    };

    module.dom_events_remove = methods;
})();
