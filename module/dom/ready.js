/**
 * A set of methods to work with DOM
 * Module must to inform the application about the completion of a page load.
 * Unlike jQuery it doesn't use the DOMContentLoaded event.
 * At the end of the document we do use the method 'onLoad'. It turns out faster.
 */
(function () {

    let DOMContentLoaded = [];

    const methods = {
        ready(callback) {
            if (typeof callback === 'function') {
                DOMContentLoaded.push(callback);
            }

            return this;
        },
        onLoad() {
            for (let i = 0, l = DOMContentLoaded.length; i < l; i++) {
                DOMContentLoaded[i]();
            }

            DOMContentLoaded = [];

            return this;
        }
    };

    module.dom_ready = methods;
})();