(function() {

    const methods = {
        getColor() {
            const getNumber = () => (Math.ceil(Math.random() * 100) + 100);
            return [].concat(
                getNumber(),
                getNumber(),
                getNumber(),
                255
            );
        },

        getSquareX(x, y, z, height, depth) {
            return [
                x, y, (z + depth),
                x, (y + height), (z + depth),
                x, y, z,
                x, y, z,
                x, (y + height), (z + depth),
                x, (y + height), z
            ];
        },

        getSquareXTexture() {
            return [
                0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1
            ];
        },

        getSquareXNormalsLess() {
            return [
                -1, 0, 0,
                -1, 0, 0,
                -1, 0, 0,
                -1, 0, 0,
                -1, 0, 0,
                -1, 0, 0
            ];
        },

        getSquareXNormalsMore() {
            return [
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
                1, 0, 0
            ];
        },

        getSquareY(x, y, z, width, depth) {
            return [
                x, y, z,
                x, y, (z + depth),
                (x + width), y, z,
                (x + width), y, z,
                x, y, (z + depth),
                (x + width), y, (z + depth)
            ];
        },

        getSquareYTexture() {
            return [
                0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1
            ];
        },

        getSquareYNormalsLess() {
            return [
                0, -1, 0,
                0, -1, 0,
                0, -1, 0,
                0, -1, 0,
                0, -1, 0,
                0, -1, 0
            ];
        },

        getSquareYNormalsMore() {
            return [
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0
            ];
        },

        getSquareZ(x, y, z, width, height) {
            return [
                x, y, z,
                x, (y + height), z,
                (x + width), y, z,
                (x + width), y, z,
                x, (y + height), z,
                (x + width), (y + height), z
            ];
        },

        getSquareZTexture() {
            return [
                0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1
            ];
        },

        getSquareZNormalsLess() {
            return [
                0, 0, -1,
                0, 0, -1,
                0, 0, -1,
                0, 0, -1,
                0, 0, -1,
                0, 0, -1
            ];
        },

        getSquareZNormalsMore() {
            return [
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
                0, 0, 1
            ];
        }
    };

    module.webGlPoints = methods;
})();

