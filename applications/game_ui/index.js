(function () {

    const templatingEngine = require('templatingEngine');
    const gameUiCommon = require('gameUiCommon');
    const GameUiSave = require('GameUiSave');
    const GameUiLoad = require('GameUiLoad');
    const GameUiMenu = require('GameUiMenu');
    const GameUiRecords = require('GameUiRecords');
    const GameUiOptions = require('GameUiOptions');
    const GameUiNewGame = require('GameUiNewGame');
    const GameUiVictory = require('GameUiVictory');
    const GameUiGameOver = require('GameUiGameOver');

    class GameUi {
        constructor(elements, game) {
            this.elements = elements;
            this._savings = JSON.parse(localStorage.getItem('savings') || '[]');
            this.isPlaying = false;
            this._difficulty = 0;
            this._game = game;
            this._options = {
                player: 'Player_' + Math.ceil(Math.random() * 100000)
            };

            this._gameUiSave = new GameUiSave();
            this._gameUiLoad = new GameUiLoad();
            this._gameUiMenu = new GameUiMenu();
            this._gameUiRecords = new GameUiRecords();
            this._gameUiOptions = new GameUiOptions();
            this._gameUiNewGame = new GameUiNewGame();
            this._gameUiVictory = new GameUiVictory();
            this._gameUiGameOver = new GameUiGameOver();

            this._setWorkFlow();
            this._setEvents();
            this._render('menu');
        }

        _setWorkFlow() {
            const showMenu = this._render.bind(this, 'menu');
            this._gameUiLoad.on('back', showMenu);
            this._gameUiSave.on('back', showMenu);
            this._gameUiRecords.on('back', showMenu);
            this._gameUiOptions.on('back', showMenu);

            this._gameUiLoad.on('load', (saveItem) => {
                this._game.load(saveItem.data);
                this._difficulty = saveItem.difficulty || 0;
                this._continue();
            });
            this._gameUiLoad.on('update_savings', (savings) => {
                this._savings = savings;
                localStorage.setItem('savings', JSON.stringify(savings));
                this._render();
            });
            this._gameUiSave.on('update_savings', (savings) => {
                this._savings = savings;
                localStorage.setItem('savings', JSON.stringify(savings));
                this._render();
            });
            this._gameUiMenu.on('update', (state) => {
                this._render(state);
                if (state === 'game') this._continue();
            });
            this._gameUiNewGame.on('select_level', (difficulty) => {
                this._difficulty = difficulty;
                this._newGame();
            });
            this._gameUiVictory.on('back', () => {
                this.showBackground();
                this._render('menu');
            });
            this._gameUiVictory.on('next', () => {
                this._newGame();
            });
            this._gameUiGameOver.on('back', () => {
                this.showBackground();
                this._render('menu');
            });
            this._gameUiGameOver.on('next', () => {
                this._newGame();
            });
        }

        _setEvents() {
            this._onKeyDown = this._onKeyDown.bind(this);
            document.body.addEventListener('keydown', this._onKeyDown, false);
        }

        _onKeyDown(event) {
            if (event.keyCode !== 27) return;
            if (this._state === 'game') {
                this.show('menu');
                this.showBackground();
                return;
            }
            if (this._state === 'menu' && this.isPlaying) {
                this._game.play();
                this.hide();
                return;
            }
            this._render('menu');
        }

        _continue() {
            this._game.play();
            this.hide();
        }

        _newGame() {
            this.isPlaying = true;
            this._game.width = [11, 21, 43][this._difficulty];
            this._game.height = [11, 21, 43][this._difficulty];
            this._game.rePlay();
            this.hide();
        }

        _render(stateName) {
            this._state = stateName || this._state;
            this.elements.content.innerHTML = '';
            if (this._state === 'save') this._gameUiSave.render(this.elements.content, this._savings, this._game, this._difficulty);
            if (this._state === 'load') this._gameUiLoad.render(this.elements.content, this._savings);
            if (this._state === 'menu') this._gameUiMenu.render(this.elements.content, this._savings, this.isPlaying);
            if (this._state === 'records') this._gameUiRecords.render(this.elements.content);
            if (this._state === 'options') this._gameUiOptions.render(this.elements.content, this._options);
            if (this._state === 'select_level') this._gameUiNewGame.render(this.elements.content, this._game);
            if (this._state === 'victory') this._gameUiVictory.render(this.elements.content, this._game.getScore());
            if (this._state === 'game_over') this._gameUiGameOver.render(this.elements.content, this._game.getScore());
        }

        hide() {
            this._state = 'game';
            this.elements.container.className = 'hidden';
            this.elements.background.className = 'hidden';
        }

        show(stateName) {
            this._game.pause();
            this._render(stateName);
            this.elements.container.className = 'game_ui__container';
        }

        showBackground() {
            this.elements.background.className = 'game_ui__background';
        }
    }

    module.exports = GameUi;
})();
