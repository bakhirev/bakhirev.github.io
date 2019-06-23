/**
 * Module to work with objects.
 *
 * Adds in the source object, methods from objects-donor. The module can be used for set default state.
 * If typeof 'source object' === 'function', adds methods from objects-donor in the 'prototype'
 * Expects the source object, and the objects-donor for inheritance of properties.
 *
 * An example of using the API:
 * var children = {},
 *     mother = { color: { eye: 'green', hair: 'black' } },
 *     parent = { color: { eye: 'blue' }, weight: 'fatty' };
 *
 * merge(children, mother, parent);
 * console.dir(children); // { color: { eye: 'blue', hair: 'black' }, weight: 'fatty' }
 *
 * merge(children, parent, mother);
 * console.dir(children); // { color: { eye: 'green', hair: 'black' }, weight: 'fatty' }
 *
 *
 * An example of using the API:
 * var Children = function () {},
 *     methods = {
 *         say: function() { alert('Hello!'); }
 *     }
 *
 * merge(Children, methods); // Children.prototype.say === methods.say;
 *
 */
(function () {

    const methods_for_merge = {
        merge() {
            if (typeof arguments[0] === 'function') {
                return this._inheritPrototypes(arguments[0], arguments);
            }
            return this._inheritList((arguments[0] || {}), arguments, 1);
        },
        _inheritPrototypes(object, arrayListsPrototypes) {
            for (let i = 1, l = arrayListsPrototypes.length; i < l; i++) {
                if (typeof arrayListsPrototypes[i] !== 'object') continue;
                for (let nameMethod in arrayListsPrototypes[i]) {
                    object.prototype[nameMethod] = arrayListsPrototypes[i][nameMethod];
                }
            }

            return object;
        },
        _inheritList(object, data, index) {
            for (let i = index || 0, l = data.length; i < l; i++) {
                if (typeof data[i] === 'object' && data[i]) this._inherit(object, data[i]);
            }

            return object;
        },
        _inherit(object, property) {
            const self = this;
            if (!object || !property) return false;
            for (let id in property) {
                if (typeof property[id] === 'undefined') continue;

                if (property[id] !== null
                    && typeof property[id] === 'object'
                    && (property[id].constructor.name === 'Object' || property[id].constructor.name === 'Array')) {

                    if (!object[id] || typeof object[id] !== 'object') {
                        object[id] = (property[id] instanceof Array) ? [] : {};
                    }

                    self._inherit(object[id], property[id]);
                } else {
                    object[id] = property[id];
                }
            }
        }
    };

    function merge() {
        return typeof arguments[0] === 'function'
            ? methods_for_merge._inheritPrototypes(arguments[0], arguments)
            : methods_for_merge._inheritList((arguments[0] || {}), arguments, 1);
    }

    module.merge = merge;
})();