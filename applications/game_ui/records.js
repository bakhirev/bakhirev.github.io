(function() {

    const EventEmitter = require('EventEmitter');
    const templatingEngine = require('templatingEngine');
    const gameUiCommon = require('gameUiCommon');

    function getScore(position) {
        const shift = 5 * position * 1000;
        const score = 3 * 60 * 1000;
        return { position: position, name: 'Player ' + Math.ceil(Math.random() * 1000), score: score + shift };
    }

    class GameUiRecords {
        constructor() {
            const COUNT = 6;
            this._tabs = [
                { title: 'Easy', value: 'easy' },
                { title: 'Middle', value: 'middle' },
                { title: 'Hard', value: 'hard' },
            ];
            this._data = {
                easy: (new Array(COUNT)).fill(1).map((_, i) => getScore(i)),
                middle: (new Array(COUNT)).fill(1).map((_, i) => getScore(i)),
                hard: (new Array(COUNT)).fill(1).map((_, i) => getScore(i))
            };
            this._parentElement = null;
            this._activeTab = 'easy';
            this._eventEmitter = new EventEmitter();
            this._onMenu = this._onMenu.bind(this);
        }

        _getTabs() {
            return {
                tag: 'div', content: this._tabs.map(tab => {
                    const className = tab.value === this._activeTab
                        ? 'game_ui__records_nav_item_hover'
                        : 'game_ui__records_nav_item';
                    const click = this._onClick.bind(this, tab.value);
                    return {
                        tag: 'div', content: [
                            { tag: 'div', content: tab.title, attributes: { className: 'game_ui__records_nav_text' }, events: { click: click } }
                        ], attributes: { className: className }
                    };
                }), attributes: { className: 'game_ui__records_nav' }
            };
        }

        _onClick(value) {
            this._activeTab = value;
            this.render();
        }

        _getFormattedTime(timeInMilliseconds) {
            const timeInSeconds = Math.floor(timeInMilliseconds / 1000);
            let minutes = Math.floor(timeInSeconds / 60);
            let seconds = timeInSeconds - minutes * 60;
            if (minutes < 10) minutes = `0${minutes}`;
            if (seconds < 10) seconds = `0${seconds}`;
            return `${minutes}:${seconds}`;
        }

        _getTableRow(data) {
            const score = this._getFormattedTime(data.score);
            return { tag: 'div', content: [
                { tag: 'div', content: [
                    { tag: 'div', content: data.position, attributes: { className: 'game_ui__records_text' } }
                ], attributes: { className: 'game_ui__records_number' } },
                { tag: 'div', content: [
                    { tag: 'div', content: data.name, attributes: { className: 'game_ui__records_text' } }
                ], attributes: { className: 'game_ui__records_name' } },
                { tag: 'div', content: [
                    { tag: 'div', content: score, attributes: { className: 'game_ui__records_text' } }
                ], attributes: { className: 'game_ui__records_score' } }
            ], attributes: { className: 'game_ui__records_row' } };
        }

        _getTable(data) {
            return {
                tag: 'div',
                content: data.map(row => this._getTableRow(row)),
                attributes: { className: 'game_ui__records_table' }
            };
        }

        _getContent() {
            const tabsTemplate = this._getTabs();
            const tableTemplate = this._getTable(this._data[this._activeTab]);
            return [
                tabsTemplate,
                tableTemplate,
                gameUiCommon.getButton('Back', 'back', this._onMenu)
            ];
        }

        render(parentElement) {
            this._parentElement = parentElement || this._parentElement;
            this._parentElement.innerHTML = '';
            templatingEngine.render(this._getContent(), this._parentElement);
        }

        _onMenu() {
            this._eventEmitter.emit('back');
        }

        on(eventName, callback) {
            this._eventEmitter.on(eventName, callback);
        }
    }

    module.exports = GameUiRecords;
})();
