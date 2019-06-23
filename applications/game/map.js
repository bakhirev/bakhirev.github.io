(function() {

    const webGlPoints = require('webGlPoints');

    const methods = {
        getElements(level) {
            const textureSlots = this._getTemplates();
            const maxRowIndex = level.length - 1;
            const maxColumnIndex = level[0].length - 1;
            level.forEach((row, rowIndex) => {
                row.forEach((code, columnIndex) => {
                    if (code === 0
                        || rowIndex === 0 || rowIndex === maxRowIndex
                        || columnIndex === 0 || columnIndex === maxColumnIndex) return;
                    this._addPoints(level, rowIndex, columnIndex, textureSlots);
                });
            });
            return textureSlots.filter(item => item.points.length);
        },
        _getTemplates() {
            return [0, 1, 2, 3, 4, 5, 6, 7].map((v, index) => ({
                points: [],
                textures: [],
                normals: [],
                textureIndex: index
            }));
        },
        _addPoints(level, row, column, textureSlots) {
            const size = 125;
            const minZ = size * row;
            const maxZ = minZ + size;
            const minX = size * column;
            const maxX = minX + size;
            const minY = size * 0;
            const maxY = minY + size;
            const isFree = this._getFreeArea(level, row, column);
            const code = level[row][column];

            this._addFloor(textureSlots[0], minX, minY, minZ, size);
            this._addRoof(textureSlots[2], minX, maxY, minZ, size);

            if (!isFree.top) this._addTopWall(textureSlots[1], minX, minY, minZ, size);
            if (!isFree.right) this._addRightWall(textureSlots[1], maxX, minY, minZ, size);
            if (!isFree.bottom) this._addTopWall(textureSlots[1], minX, minY, maxZ, size);
            if (!isFree.left) this._addLeftWall(textureSlots[1], minX, minY, minZ, size);

            if (code === 1 && isFree.top) this._addTopWall(textureSlots[3], minX, minY, minZ, size);
            if (code === 1 && isFree.right) this._addRightWall(textureSlots[3], maxX, minY, minZ, size);
            if (code === 1 && isFree.bottom) this._addTopWall(textureSlots[3], minX, minY, maxZ, size);
            if (code === 1 && isFree.left) this._addLeftWall(textureSlots[3], minX, minY, minZ, size);

            const miniSize = 25;
            const halfSize = size / 2;
            const isPass = code === 10 || code === 11 || code === 12;
            if (isPass && (isFree.top || isFree.bottom)) this._addTopWall(textureSlots[4], minX + 50, 5, minZ + halfSize, miniSize);
            if (isPass && (isFree.right || isFree.left)) this._addRightWall(textureSlots[4], maxX - halfSize, 5, minZ + 50, miniSize);
        },
        _getFreeArea(level, row, column) {
            return {
                top: level[row - 1][column] !== 0,
                right: level[row][column + 1] !== 0,
                bottom: level[row + 1][column] !== 0,
                left: level[row][column - 1] !== 0,
            };
        },
        _addFloor(textureSlot, minX, minY, minZ, size) {
            Array.prototype.push.apply(textureSlot.points, webGlPoints.getSquareY(minX, minY, minZ, size, size));
            Array.prototype.push.apply(textureSlot.textures, webGlPoints.getSquareYTexture());
            Array.prototype.push.apply(textureSlot.normals, webGlPoints.getSquareYNormalsLess());
        },
        _addRoof(textureSlot, minX, maxY, minZ, size) {
            Array.prototype.push.apply(textureSlot.points, webGlPoints.getSquareY(minX, maxY, minZ, size, size));
            Array.prototype.push.apply(textureSlot.textures, webGlPoints.getSquareYTexture());
            Array.prototype.push.apply(textureSlot.normals, webGlPoints.getSquareYNormalsMore());
        },
        _addTopWall(textureSlot, minX, minY, minZ, size) {
            Array.prototype.push.apply(textureSlot.points, webGlPoints.getSquareZ(minX, minY, minZ, size, size));
            Array.prototype.push.apply(textureSlot.textures, webGlPoints.getSquareZTexture());
            Array.prototype.push.apply(textureSlot.normals, webGlPoints.getSquareZNormalsLess());
        },
        _addRightWall(textureSlot, maxX, minY, minZ, size) {
            Array.prototype.push.apply(textureSlot.points, webGlPoints.getSquareX(maxX, minY, minZ, size, size));
            Array.prototype.push.apply(textureSlot.textures, webGlPoints.getSquareXTexture());
            Array.prototype.push.apply(textureSlot.normals, webGlPoints.getSquareXNormalsMore());
        },
        _addBottomWall(textureSlot, minX, minY, maxZ, size) {
            Array.prototype.push.apply(textureSlot.points, webGlPoints.getSquareZ(minX, minY, maxZ, size, size));
            Array.prototype.push.apply(textureSlot.textures, webGlPoints.getSquareZTexture());
            Array.prototype.push.apply(textureSlot.normals, webGlPoints.getSquareZNormalsMore());
        },
        _addLeftWall(textureSlot, minX, minY, minZ, size) {
            Array.prototype.push.apply(textureSlot.points, webGlPoints.getSquareX(minX, minY, minZ, size, size));
            Array.prototype.push.apply(textureSlot.textures, webGlPoints.getSquareXTexture());
            Array.prototype.push.apply(textureSlot.normals, webGlPoints.getSquareXNormalsLess());
        }
    };

    module.webGlMap = methods;
})();

