(function() {

    const EventEmitter = require('EventEmitter');
    const templatingEngine = require('templatingEngine');
    const gameUiCommon = require('gameUiCommon');

    class GameUiGameOver {
        constructor() {
            this._eventEmitter = new EventEmitter();
            this._onMenu = this._onMenu.bind(this);
            this._onNewGame = this._onNewGame.bind(this);
        }

        _getContent() {
            return [
                gameUiCommon.getDescription('Game over!'),
                gameUiCommon.getSmallButton('Menu', 'back', this._onMenu),
                gameUiCommon.getSmallButton('Replay', 'new_game', this._onNewGame)
            ];
        }

        render(parentElement) {
            templatingEngine.render(this._getContent(), parentElement);
        }

        _onMenu() {
            this._eventEmitter.emit('back');
        }

        _onNewGame() {
            this._eventEmitter.emit('next');
        }

        on(eventName, callback) {
            this._eventEmitter.on(eventName, callback);
        }
    }

    module.exports = GameUiGameOver;
})();
