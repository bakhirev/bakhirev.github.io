/**
 * A set of methods to work with DOM
 *
 * The module has the following API:
 * addEvent() - adds an event for DOM-element. Expects three mandatory arguments and one optional.
 * stopEvent() - stops the event. Expects one mandatory arguments: object of event.
 *
 * addEvent() is needed to solve the problems:
 * - cross-browser add event (written polymorphic, so it works faster);
 * - adds touch-events instead of click-event for mobile phones;
 */
(function () {

    const is = require('is');
    const domEventsName = require('domEventsName');

    const methods = { // TODO: check code-style
        addEvent(element, eventName, callback, context) {
            const self = this;

            if (!element || !eventName || !callback) return;

            if (context) {
                callback = self.getInContext(callback, context);
            }

            eventName = domEventsName.getFixedEventName(element, eventName);

            if (is.ie && element.nodeName === 'SCRIPT') {
                if (eventName === 'error') return;
                if (eventName === 'load') {
                    return self._addReadyStateChange(element, callback);
                }
            }

            if (is.mobile && eventName === 'click') {
                self._addEvent(element, 'touchstart', callback);
                self._addEvent(element, 'touchstart', self.stopEvent);
                self._addEvent(element, 'touchmove', self.stopEvent);
                self._addEvent(element, 'touchend', self.stopEvent);
            } else {
                self._addEvent(element, eventName, callback);
            }
        },
        _addEvent(element, eventName, callback) {
            const self = this;

            if (element.addEventListener) {
                self._addEvent = self._addEventForOther;
            } else if (element.attachEvent) {
                self._addEvent = self._addEventForIe;
            } else {
                return;
            }

            self._addEvent(element, eventName, callback);
        },
        _addEventForIe(element, eventName, callback) {
            element.attachEvent('on' + eventName, callback);
        },
        _addEventForOther(element, eventName, callback) {
            element.addEventListener(eventName, callback, false);
        },
        getInContext(callback, context) {
            return function (event) {
                event = event || window.event;
                const delta = event.deltaY || event.detail || event.wheelDelta || 0;
                callback.apply(context, [event, delta]);
            };
        },
        getDelta(event) {
            event = event || window.event;
            return event.deltaY || event.detail || event.wheelDelta || 0;
        },
        _addReadyStateChange(element, callback) {
            element.onreadystatechange = function () {
                if (this.readyState === 'complete') {
                    callback();
                }

                if (this.readyState === 'loaded') {
                    setTimeout(callback, 0);
                    this.onreadystatechange = null;
                }
            };
        },
        stopEvent(event) {
            if (!event) return;

            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }

            if (event.preventDefault) {
                event.preventDefault();
            }
        }
    };

    module.dom_events = methods;
})();