(function () {

    const dom_elements = require('dom_elements');
    const GameUi = require('GameUi');
    const Game = require('Game');

    const textures = [
        // './images/textures/kirpich.jpg',
        './images/textures/laminat.jpg',
        './images/textures/2.jpg',
        './images/textures/3.jpg',
        './images/textures/6.jpg', // kirpich
        './images/textures/pass.png'
        //
    ];

    const sounds = [
        './mp3/pass.mp3',
        './mp3/dead.mp3',
        './mp3/time.mp3',
        './mp3/radiation.mp3',
    ].map(path => fetch(path));

    function loadTextures(textures, callback) {
        let numberOfTextures = 0;
        const onLoad = () => {
            numberOfTextures -= 1;
            if (!numberOfTextures) callback(images);
        };
        const images = textures.map((path) => {
            numberOfTextures += 1;
            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.src = path;
            image.onload = onLoad;
            return image;
        });
    }

    loadTextures(textures, images => {
        const elements = dom_elements.get({
            display: 'view',
            map: 'mini_map_display',
            samosbor: 'display__samosbor',
            health: 'display__health',
            time: 'display__time',
            input: 'joystick',
            damage: 'damage_screen',
            pass: 'pass',
        });
        const game = new Game(elements, images);

        const elementsUi = dom_elements.get({
            background: 'game_ui__background',
            container: 'game_ui',
            content: 'game_ui__content',
        });
        const gameUi = new GameUi(elementsUi, game);

        game.on('victory', function() {
            gameUi.isPlaying = false;
            setTimeout(() => {
                gameUi.show('victory');
            }, 2000);
        });
        game.on('game_over', function() {
            gameUi.isPlaying = false;
            setTimeout(() => {
                gameUi.show('game_over');
            }, 2000);
        });
    });

})();
