/**
 * A set of methods to work with functions.
 *
 * The module has the following API:
 * getName() - get function name. Expects one mandatory argument: function.
 *
 */
(function () {

    const methods = {
        getName(fun) {
            if (fun.name) {
                return fun.name;
            }

            if (!fun.toString) {
                return '';
            }

            let functionName = (fun.toString().match(/function\s{0,1}[A-Za-z]{1}[A-Za-z0-9\_\-]{0,}\(/gim) || [])[0] || '';
            functionName = functionName.replace(/^function\s{0,1}|\(/gim, '') || '';

            return functionName;
        },
        getInContext: function(callback, context) {
            if (typeof callback !== 'function') return null;
            if (!context) return callback;
            return callback.bind(context);
        }
    };

    module.functions = methods;
}());