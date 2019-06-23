(function() {

    const tools = {
        move: [0, 0, 0],
        rotate: [0, 0, 0],
        update: null
    };

    const data = JSON.parse(localStorage.getItem('__3d') || '{}');
    if (data.move) {
        tools.move = data.move;
    }
    if (data.rotate) {
        tools.rotate = data.rotate;
    }

    [
        // [ 'move_x', 'move', 0 ],
        // [ 'move_y', 'move', 1 ],
        // [ 'move_z', 'move', 2 ],
        ['rotate_x', 'rotate', 0],
        ['rotate_y', 'rotate', 1],
        ['rotate_z', 'rotate', 2]
    ].forEach((config) => {
        const id = config[0];
        const propertyName = config[1];
        const index = config[2];

        const element = document.getElementById(id);
        element.value = tools[propertyName][index];

        element.addEventListener('input', () => {
            const value = propertyName === 'rotate'
                ? (((+event.target.value) * Math.PI) / 180)
                : +event.target.value;
            tools[propertyName][index] = value;
            tools.update && tools.update();
            localStorage.setItem('_3d', JSON.stringify({
                move: tools.move,
                rotate: tools.rotate
            }));
        }, false);
    });

    module.tools = tools;
})();
