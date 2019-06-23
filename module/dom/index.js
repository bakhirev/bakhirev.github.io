(function () {

    const merge = require('merge');
    const dom_events = require('dom_events');
    const dom_elements = require('dom_elements');
    const domEventsName = require('domEventsName');
    const dom_events_remove = require('dom_events_remove');
    const dom_events_trigger = require('dom_events_trigger');
    const methods = {};

    const dom = merge(
        methods,
        dom_events,
        dom_elements,
        domEventsName,
        dom_events_remove,
        dom_events_trigger
    );

    module.dom = methods;
})();