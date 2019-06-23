(function () {

    class Physics {
        constructor() {}

        addCollision(cameraPosition, level, shift) {
            const position = this.getPosition(cameraPosition.move);
            const newCoordinate = this._getNewCoordinate(cameraPosition.move, shift);
            const limits = this._getLimits(position, level);

            if (limits.top && newCoordinate[2] < limits.top) newCoordinate[2] = limits.top;
            if (limits.bottom && newCoordinate[2] > limits.bottom) newCoordinate[2] = limits.bottom;
            if (limits.right && newCoordinate[0] > limits.right) newCoordinate[0] = limits.right;
            if (limits.left && newCoordinate[0] < limits.left) newCoordinate[0] = limits.left;

            const newPosition = this.getPosition(newCoordinate);
            const code = level[newPosition.row][newPosition.column];
            if (code !== 0) {
                cameraPosition.move = newCoordinate;
            }

            return position;
        }

        _getNewCoordinate(cameraPosition, shift) {
            const newCoordinate = [...cameraPosition];
            newCoordinate[0] += shift.dx;
            newCoordinate[2] += shift.dz;
            return newCoordinate;
        }

        getPosition(cameraPosition) {
            const size = 125;
            return {
                row: Math.floor(cameraPosition[2] / size),
                column: Math.floor(cameraPosition[0] / size)
            };
        }

        _getLimits(position, level) {
            const size = 125;
            const padding = 15;
            return {
                top: level[position.row - 1][position.column] < 9 ? ((position.row - 1 ) * size + size + padding) : null,
                right: level[position.row][position.column + 1] < 9 ? ((position.column + 1 ) * size - padding) : null,
                bottom: level[position.row + 1][position.column] < 9 ? ((position.row + 1 ) * size - padding) : null,
                left: level[position.row][position.column - 1] < 9 ? ((position.column - 1 ) * size + size + padding) : null
            };
        }
    }

    module.exports = Physics;
})();
