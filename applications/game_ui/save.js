(function() {

    const EventEmitter = require('EventEmitter');
    const templatingEngine = require('templatingEngine');
    const gameUiCommon = require('gameUiCommon');

    class GameUiSave {
        constructor() {
            this.elements = {};
            this._savings = [];
            this._difficulty = 0;
            this._game = null;
            this._parentElement = null;
            this._eventEmitter = new EventEmitter();
            this._setWorkFlow();
        }

        _setWorkFlow() {
            this._onKeyDown = this._onKeyDown.bind(this);
            this._onSave = this._onSave.bind(this);
            this._onMenu = this._onMenu.bind(this);
            this._renderDefaultPage = this._renderDefaultPage.bind(this);
        }

        _onKeyDown(event) {
            if (event.keyCode === 13) this._onSave();
        }

        _onSave() {
            const title = this.elements.input.value;
            if (!title) return;
            const today = new Date();
            this._savings.push(this._getSaveObject(title));
            this.elements.input.value = '';
            this._eventEmitter.emit('update_savings', this._savings);
        }

        _getSaveObject(title) {
            const today = new Date();
            return {
                title: title || today.toISOString().replace('T', ' ').substring(0, 19),
                date: today.getTime(),
                data: this._game.save(),
                difficulty: this._difficulty
            }
        }

        _getList() {
            return [...this._savings].reverse().map(data => ({
                tag: 'div', content: [
                    { tag: 'div', content: data.title || '', attributes: { className: 'game_ui__save_title' }, events: { click: this._onReplace.bind(this, data) } },
                    { tag: 'div', attributes: { className: 'game_ui__save_remove' }, events: { click: this._onRemove.bind(this, data) } }
                ], attributes: { className: 'game_ui__save_container' }
            }));
        }

        _getInput() {
            return [
                gameUiCommon.getInput('', 'Enter title', this._onKeyDown, this._onSave),
                { tag: 'div', content: this._getList(), attributes: { className: 'game_ui__list' } },
                gameUiCommon.getButton('Back', 'back', this._onMenu)
            ];
        }

        render(parentElement, savings, game, difficulty) {
            this._parentElement = parentElement;
            this._difficulty = difficulty;
            this._savings = savings;
            this._game = game;
            this._renderDefaultPage();
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
            this._parentElement = null;
            this._eventEmitter.emit('back');
        }

        _renderDefaultPage() {
            const template = this._getInput();
            this._parentElement.innerHTML = '';
            this.elements = templatingEngine.renderWithLinks(template, this._parentElement);
            const input = this.elements.input.focus();
            if (input) input.focus();
        }

        _onRemove(data) {
            this._showConfirm('Are you sure? The item will be removed!', 'Saving was removed', () => {
                const savings = this._savings.filter(item => item !== data);
                this._eventEmitter.emit('update_savings', savings);
            });
        }

        _onReplace(data) {
            this._showConfirm('Are you sure? The item will be overwritten!', 'Game was saved', () => {
                const savings = this._savings.filter(item => item !== data);
                const saveObject = this._getSaveObject(data.title);
                savings.push(saveObject);
                this._eventEmitter.emit('update_savings', savings);
            });
        }

        on(eventName, callback) {
            this._eventEmitter.on(eventName, callback);
        }
    }

    module.exports = GameUiSave;
})();
