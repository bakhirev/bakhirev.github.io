/**
 * Class 'Is'
 * Creates object 'is' for work with User-Agent.
 *
 * An example of a class instance creation:
 * var is = Is().is;
 *
 * Each instance of the class has the following API:
 *  is.ie      - this is Internet Explorer?
 *  is.bada    - this is Bada?
 *  is.android - this is Android?
 *  is.ios     - this is Apple?
 *  is.wp      - this is Windows Phone?
 *  is.windows - this is Windows?
 *
 */
(function () {

    const merge = require('merge');

    class Is {
        constructor(userProperty) {
            const publicProperty = {
                is: {},
                rules: {
                    ie: /(MSIE)/gim,
                    bada: /(Bada)+/gim,
                    chrome: /(Chrome)/gim,
                    android: /(Android)+/gim,
                    ios: /(iPhone)|(iPad)/gim,
                    wp: /(Windows\sPhone)/gim,
                    windows: /(Windows\sNT)/gim,
                    linux: /(Linux)/gim,
                    mac: /(Macintosh)/gim
                },
                information: {
                    chrome: {
                        version: {
                            search: /(Chrome\/[0-9]+)/gim,
                            clear: /([^0-9]+)/gim
                        }
                    }
                }
            };

            merge(this, publicProperty, userProperty);

            this.update();
        }

        update() {
            const self = this;
            const userAgent = navigator.userAgent.toLowerCase();

            for (let id in self.rules) {
                if (userAgent.match(self.rules[id])) {
                    self.is[id] = self._getInformation(id, userAgent);
                } else {
                    self.is[id] = false;
                }
            }

            self._addOtherIs();
            self._fixedLinux();
            self._fixedWindowsPhone();
        }

        _addOtherIs() {
            const self = this;
            self.is.mobile = !!(self.is.android || self.is.ios || self.is.wp || self.is.bada);
        }

        _fixedLinux() {
            const self = this;

            if (!self.is.linux) return;
            if (self.is.bada
                || self.is.android
                || self.is.ios
                || self.is.mac) {
                self.is.linux = false;
            }
        }

        _fixedWindowsPhone() {
            const self = this;

            if (!self.is.wp) return;

            for (let id in self.is) {
                self.is[id] = false;
            }

            self.is.wp = true;
        }

        _getInformation(id, userAgent) {
            const data = {};
            const information = this.information[id];

            for (let propertyName in information) {
                let item = information[propertyName],
                    result = (userAgent.match(item.search) || [])[0] || '',
                    value = result.replace(item.clear, '');

                data[propertyName] = value || null;
            }

            return data;
        }
    }

    module.exports = Is;
})();