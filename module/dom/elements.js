/**
 * A set of methods to work with DOM
 *
 * The module has the following API:
 * get() - return DOM-elements. Expects one mandatory object:
 *  id of DOM-element (an string at the entrance and DOM-element at the output),
 *  or array id of DOM-element (an array of strings at the entrance and array DOM-elements at the output),
 *  or an associative array (object, { someKey: 'id of DOM-element' } at the entrance and { someKey: DOM-element } at the output),
 *
 * clear() - clears the contents of the DOM-element. Expects one mandatory arguments: DOM-element.
 * ready() - called callback-function after loading the document. Expects one mandatory arguments: callback-function.
 * onLoad() - this is hack. We are not waiting for the DOMContentLoaded event, and to order to execute the handlers attached to 'ready' at the moment.
 *
 * get() is needed to solve the problems:
 * - counting the number of used elements;
 *
 * clear() is needed to solve the problems:
 * - fixed the bug of empty tables in IE;
 *
 */
(function () {

    const is = require('is');

    const methods = {
        _getElementById: document.getElementById.bind(document),
        get(listOfId) {
            const type = typeof listOfId;

            if (type === 'string') {
                return this.getElementById(listOfId);
            }

            if (!listOfId || type !== 'object') return null;

            if (listOfId instanceof Array) {
                return this.getArrayElementsById(listOfId);
            }

            return this.getObjectElementsById(listOfId);
        },
        getElementById(id) {
            return this._getElementById(id);
        },
        getArrayElementsById(listOfId) {
            const arrayElements = [];
            for (let i = 0, l = listOfId.length; i < l; i++) {
                arrayElements[i] = this.getElementById(listOfId[i]);
            }
            return arrayElements;
        },
        getObjectElementsById(listOfId) {
            const objectElements = {};
            for (let id in listOfId) {
                objectElements[id] = this.getElementById(listOfId[id]);
            }
            return objectElements;
        },
        clear(element) {
            if (!element) return this;

            if (!is.ie && !is.wp && element.nodeName !== 'TBODY') {
                element.innerHTML = '';
                return this;
            }

            for (let i = element.childNodes.length - 1; i >= 0; i--) {
                element.removeChild(element.childNodes[i]);
            }

            return this;
        }
    };

    module.dom_elements = methods;
})();