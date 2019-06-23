(function() {

    const dom_events = require('dom_events');
    const dom_elements = require('dom_elements');

    class MainMenu {
        constructor() {
            this._elements = dom_elements.get({
                container: 'menu_container',
                mapContainer: 'map_container',
                continue: 'menu_continue',
                newGame: 'menu_new_game',
                load: 'menu_load',
                save: 'menu_save',
                map: 'menu_map',
                rating: 'menu_rating',
                options: 'menu_options',
            });
            this._setWorkFlow();
            this._setEvents();
        }

        _setWorkFlow() {
            this._onContinue = this._onContinue.bind(this);
            this._onNewGame = this._onNewGame.bind(this);
            this._onMap = this._onMap.bind(this);
        }

        _setEvents() {
            dom_events.addEvent(this._elements.continue, 'click', this._onContinue);
            dom_events.addEvent(this._elements.newGame, 'click', this._onNewGame);
            dom_events.addEvent(this._elements.map, 'click', this._onMap);
        }

        _onContinue() {
            this._elements.container.className = 'hidden';
        }

        _onNewGame() {
            this._elements.container.className = 'hidden';
        }

        _onMap() {
            this._elements.container.className = 'hidden';
            this._elements.mapContainer.className = 'map__container';
        }
    }

    module.exports = MainMenu;
})();

