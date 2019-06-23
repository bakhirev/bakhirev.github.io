/**
 * A set of methods to work with DOM-events.
 *
 * The module has the following API:
 * triggerEvent() - trigger the event for DOM-element.
 *                  Expects two mandatory arguments: DOM-element and event name.
 *
 * Code is polymorphic, because it works faster.
 *
 */
(function () {

    const methods = {
        triggerEvent(element, eventName) {
            const self = this;

            if (document.createEvent) {
                self.triggerEvent = self._triggerEventForOther;
            } else if (document.createEventObject) {
                self.triggerEvent = self._triggerEventForIe;
            } else {
                return;
            }

            self.triggerEvent(element, eventName);
        },
        _triggerEventForIe(element, eventName) {
            const event = document.createEventObject();
            event.eventType = eventName;
            event.eventName = eventName;
            element.fireEvent('on' + event.eventType, event);
        },
        _triggerEventForOther(element, eventName) {
            const event = document.createEvent('HTMLEvents');
            event.initEvent(eventName, true, true);
            event.eventName = eventName;
            element.dispatchEvent(event);
        }
    };

    module.dom_events_trigger = methods;
})();