(function() {

    const EventEmitter = require('EventEmitter');
    const templatingEngine = require('templatingEngine');
    const gameUiCommon = require('gameUiCommon');

    class GameUiOptions {
        constructor() {
            this._eventEmitter = new EventEmitter();
            this._onKeyDown = this._onKeyDown.bind(this);
            this._onMenu = this._onMenu.bind(this);
        }

        _getContent(options) {
            return [
                gameUiCommon.getInput(options.player, 'Enter name', this._onKeyDown, this._onSave),
                gameUiCommon.getInput('', 'Enter code', this._onKeyDown, this._onSave),
                gameUiCommon.getButton('Back', 'back', this._onMenu)
            ];
        }

        _onKeyDown(event) {
            if (event.keyCode === 13) this._onSave();
        }

        render(parentElement, options) {
            templatingEngine.render(this._getContent(options), parentElement);
        }

        _onMenu() {
            this._eventEmitter.emit('back');
        }

        on(eventName, callback) {
            this._eventEmitter.on(eventName, callback);
        }
    }

    module.exports = GameUiOptions;
})();
