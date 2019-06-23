(function() {

    const EventEmitter = require('EventEmitter');
    const templatingEngine = require('templatingEngine');
    const gameUiCommon = require('gameUiCommon');

    class GameUiVictory {
        constructor() {
            this._eventEmitter = new EventEmitter();
            this._onMenu = this._onMenu.bind(this);
            this._onNewGame = this._onNewGame.bind(this);
        }

        _getContent(time) {
            const timeSeconds = Math.floor(time / 1000);
            let minutes = Math.floor(timeSeconds / 60);
            let seconds = timeSeconds - minutes * 60;
            if (minutes < 10) minutes = `0${minutes}`;
            if (seconds < 10) seconds = `0${seconds}`;
            const formattedTime = `${minutes}:${seconds}`;

            return [
                gameUiCommon.getDescription('Are you victory!'),
                gameUiCommon.getSmallButton('Menu', 'back', this._onMenu),
                gameUiCommon.getSmallButton('Next', 'new_game', this._onNewGame)
            ];
        }

        render(parentElement, time) {
            templatingEngine.render(this._getContent(time), parentElement);
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

    module.exports = GameUiVictory;
})();
