(function () {

    const dom_events = require('dom_events');

    const methods = {
        createElement(item, parentElement, linkOnElements) {
            const self = this;
            const element = self._createElement(item);

            if (!element) return null;

            self.setAttribute(element, item);
            self.setEvents(element, item);
            self.addContent(item, element, linkOnElements);
            self._addInParentElement(element, parentElement);

            if (item.id) {
                linkOnElements._hasElements = true;
                linkOnElements[item.id] = element;
            }

            return element;
        },
        _createElement(item) {
            if (item && item.tag) {
                return document.createElement(item.tag);
            }

            if (item && item.content) {
                return document.createTextNode(item.content);
            }

            return null;
        },
        createTextNode(item, parentElement) {
            const element = document.createTextNode(item);
            this._addInParentElement(element, parentElement);
            return element;
        },
        setAttribute(element, item) {
            if (!item.attributes) return this;

            for (let attributeName in item.attributes) {
                const correctAttributeName = this._correctAttributeName[attributeName] || attributeName;
                const value = item.attributes[attributeName] || '';

                element.setAttribute(correctAttributeName, value);
            }
        },
        setEvents(element, item) {
            if (!item.events) return this;

            for (let eventName in item.events) {
                dom_events.addEvent(element, eventName, item.events[eventName]);
            }
        },
        _correctAttributeName: {
            className: 'class'
        },
        _addInParentElement(element, parentElement) {
            if (parentElement) {
                parentElement.appendChild(element);
            }
        },
        addContent(item, element, linkOnElements) {
            const self = this;
            const typeContent = typeof item.content;

            if (typeContent === 'string'
                || typeContent === 'number') {
                element.innerHTML = item.content;
                return;
            }

            if (!(item.content instanceof Array)) return;

            for (let i = 0, l = item.content.length; i < l; i++) {
                const contentItem = item.content[i];
                const type = typeof contentItem;

                if (type === 'string'
                    || type === 'number') {
                    self.createTextNode(contentItem, element);
                } else {
                    self.createElement(contentItem, element, linkOnElements);
                }
            }
        },


        render(template, parentInfo, linkOnElements) {
            const self = this;
            const elements = [];
            const parentElement = self._getParentElement(parentInfo);
            linkOnElements = linkOnElements || {};

            if (typeof template !== 'object') return null;

            if (!(template instanceof Array)) {
                return self.createElement(template, parentElement, linkOnElements);
            }

            for (let i = 0, l = template.length; i < l; i++) {
                elements.push(self.createElement(template[i], parentElement, linkOnElements));
            }

            return elements;
        },
        renderWithLinks(template, parentInfo) {
            const linkOnElements = {};
            this.render(template, parentInfo, linkOnElements);
            return linkOnElements;
        },
        _getParentElement(parentElement) {
            if (typeof parentElement === 'string') {
                return document.getElementById(parentElement);
            }

            if (typeof parentElement === 'object') {
                return parentElement;
            }

            return null;
        }
    };


    module.templatingEngine = methods;
})();
