(function() {

    const EventEmitter = require('EventEmitter');
    const templatingEngine = require('templatingEngine');
    const gameUiCommon = require('gameUiCommon');

    class GameUiNewGame {
        constructor() {
            this._eventEmitter = new EventEmitter();
        }

        _getContent() {
            return [
                gameUiCommon.getButton('Easy', 'level_easy', this._onMenu.bind(this, 0)),
                gameUiCommon.getButton('Medium', 'level_medium', this._onMenu.bind(this, 1)),
                gameUiCommon.getButton('Hard', 'level_hard', this._onMenu.bind(this, 2))
            ];
        }

        render(parentElement) {
            templatingEngine.render(this._getContent(), parentElement);
        }

        _onMenu(difficulty) {
            this._eventEmitter.emit('select_level', difficulty);
        }

        on(eventName, callback) {
            this._eventEmitter.on(eventName, callback);
        }
    }

    module.exports = GameUiNewGame;
})();
