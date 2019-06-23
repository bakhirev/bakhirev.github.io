(function (global) {
    'use strict';

    global = global || {};
    global.module = {};

    global.require = function (moduleName) {
        return global.module[moduleName] || null;
    };

    Object.defineProperty(global.module, 'exports', {
        get: function () {
            return null;
        },
        set: function (Constructor) {
            if (typeof Constructor !== 'function') return;

            const moduleName = methods.getFunctionName(Constructor);
            global.module[moduleName] = Constructor;

            return Constructor;
        }
    });

    const methods = {
        getFunctionName: function (Constructor) {
            if (Constructor.name) {
                return Constructor.name;
            }

            if (!Constructor.toString) {
                return "";
            }

            let functionName = (Constructor.toString().match(/function\s{0,1}[A-Za-z]{1}[A-Za-z0-9\_\-]{0,}\(/gim) || [])[0] || "";
            functionName = functionName.replace(/^function\s{0,1}|\(/gim, "") || "";

            return functionName;
        },
        isClass: function (Constructor) {
            for (let methodName in Constructor.prototype) return true;
            return !!!Constructor.toString().indexOf("class");
        }
    };

})(this);