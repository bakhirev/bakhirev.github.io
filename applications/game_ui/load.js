(function () {

    const EventEmitter = require('EventEmitter');
    const templatingEngine = require('templatingEngine');
    const gameUiCommon = require('gameUiCommon');

    class GameUiLoad {
        constructor() {
            this._savings = [];
            this._parentElement = null;
            this._eventEmitter = new EventEmitter();
            this._onMenu = this._onMenu.bind(this);
            this._renderDefaultPage = this._renderDefaultPage.bind(this);
        }

        _getSavings() {
            return [...this._savings].reverse().map(data => ({
                tag: 'div', content: [
                    {
                        tag: 'div',
                        content: data.title || '',
                        attributes: { className: 'game_ui__save_title' },
                        events: { click: this._onLoad.bind(this, data) }
                    },
                    {
                        tag: 'div',
                        attributes: { className: 'game_ui__save_remove' },
                        events: { click: this._onRemove.bind(this, data) }
                    }
                ], attributes: { className: 'game_ui__save_container' }
            }));
        }

        _getContent() {
            const content = this._getSavings();
            return [
                { tag: 'div', content: content, attributes: { className: 'game_ui__list' } },
                gameUiCommon.getButton('Back', 'back', this._onMenu)
            ]
        }

        render(parentElement, savings) {
            this._parentElement = parentElement;
            this._savings = savings;
            this._renderDefaultPage();
        }

        _renderDefaultPage() {
            templatingEngine.render(this._getContent(), this._parentElement);
        }

        _showConfirm(question, message, successCallback) {
            this._parentElement.innerHTML = '';
            const template = gameUiCommon.getConfirm(question, () => { this._showAlert(message, successCallback) }, this._renderDefaultPage);
            this.elements = templatingEngine.renderWithLinks(template, this._parentElement);
        }

        _showAlert(message, successCallback) {
            this._parentElement.innerHTML = '';
            const template = gameUiCommon.getAlert(message, successCallback);
            this.elements = templatingEngine.renderWithLinks(template, this._parentElement);
        }

        _onMenu() {
            this._eventEmitter.emit('back');
        }

        _onRemove(data) {
            this._showConfirm('Are you sure? The item will be removed!', 'Saving was removed', () => {
                const savings = this._savings.filter(item => item !== data);
                this._eventEmitter.emit('update_savings', savings);
                if (!savings.length) return this._eventEmitter.emit('back');
            });
        }

        _onLoad(data) {
            this._eventEmitter.emit('load', data);
        }

        on(eventName, callback) {
            this._eventEmitter.on(eventName, callback);
        }
    }

    module.exports = GameUiLoad;
})();
