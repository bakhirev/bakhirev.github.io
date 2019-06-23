/*
 * This is a set of methods for get mouse coordinates relative DOM-element, when was obtained the event.
 *
 * A list of public methods:
 *  getRelativeDocument(event) - get mouse coordinates relative document.
 *  getRelativeWindow(event) - get mouse coordinates relative window.
 *  getPercentRelativeElement(event, element) - get mouse coordinates relative DOM-element.
 *
 * Example usage:
 * var element = document.getElementById('some_id');
 * $(element)click((event) => console.log(mouseCoordinates.getPercentRelativeElement(event, element)));
 *
 */
(function () {

    const methods = {
        getRelativeDocument(event) {
            if (event.pageX === null && event.clientX !== null) {
                return this._getRelativeDocumentForIe(event);
            }

            return this._getRelativeDocumentForOther(event);
        },
        getRelativeWindow(event) {
            const touch = (event.targetTouches || [])[0] || (event.changedTouches || [])[0];

            if (!touch) return {
                x: event.clientX,
                y: event.clientY
            };

            return {
                x: touch.clientX,
                y: touch.clientY
            };
        },
        getPercentRelativeElement(event, element, isWithoutLimits) {
            const coordinates = this.getRelativeElement(event, element, isWithoutLimits);
            const elementSize = this._getElementSize(element);

            if (!isWithoutLimits) {
                this._addLimits(relativeMouseCoordinates, elementCoordinates);
            }

            return {
                x: Math.round((100 / elementSize.width) * coordinates.x),
                y: Math.round((100 / elementSize.height) * coordinates.y)
            };
        },
        getRelativeElement(event, element, isWithoutLimits) {
            const mouseCoordinates = this.getRelativeWindow(event);
            const elementCoordinates = element.getBoundingClientRect();
            const relativeMouseCoordinates = {
                x: mouseCoordinates.x - elementCoordinates.left,
                y: elementCoordinates.bottom - mouseCoordinates.y
            };

            if (!isWithoutLimits) {
                this._addLimits(relativeMouseCoordinates, elementCoordinates);
            }
            return relativeMouseCoordinates;
        },
        _addLimits: function (relativeMouseCoordinates, elementCoordinates) {
            if (relativeMouseCoordinates.y < 0) {
                relativeMouseCoordinates.y = 0;
            }

            if (relativeMouseCoordinates.x < 0) {
                relativeMouseCoordinates.x = 0;
            }

            const elementHeight = elementCoordinates.bottom - elementCoordinates.top;
            if (relativeMouseCoordinates.y > elementHeight) {
                relativeMouseCoordinates.y = elementHeight;
            }

            const elementWidth = elementCoordinates.right - elementCoordinates.left;
            if (relativeMouseCoordinates.x > elementWidth) {
                relativeMouseCoordinates.x = elementWidth;
            }

            return relativeMouseCoordinates;
        },
        _getElementSize: function (element) {
            const elementCoordinates = element.getBoundingClientRect();

            return {
                height: elementCoordinates.bottom - elementCoordinates.top,
                width: elementCoordinates.right - elementCoordinates.left
            };
        },
        _getRelativeDocumentForOther(event) {
            return {
                x: event.pageX,
                y: event.pageY
            };
        },
        _getRelativeDocumentForIe(event) {
            const html = document.documentElement;
            const body = document.body;

            return {
                x: event.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0),
                y: event.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
            };
        }
    };

    module.mouseCoordinates = methods;
})();