(function () {

    const level = require('level');

    const methods = {
        getDistanceMap(originLevel) {
            const copy = level.getCopy(originLevel);
            const distanceMap = level.getCopy(originLevel);
            const response = this.setMaxDistance(copy, { row: 1, column: 1, prev: { row: 0, column: 1 }, way: 1, crossroad: 0, neighbors: 1 });
            response.value = 1;
            const response2 = this.setMaxDistance(distanceMap, response[1]);

            const finishingDeadlocks = response2[2].filter(item => !(item.row === response2[1].row && item.column === response2[1].column));
            finishingDeadlocks.sort((a, b) => ((b.crossroad - a.crossroad) || (b.way - a.way)));
            return {
                maxDistance: response2[0],
                begin: response2[1],
                end: response[1],
                distanceMap: distanceMap,
                deadlocks: finishingDeadlocks,
            };
        },

        setMaxDistance(originLevel, firstPoint) {
            let maxDistance = 0;
            let lastPoint = firstPoint;
            let forks = [firstPoint];
            const branches = level.getCopy(originLevel);
            const deadlocks = [];

            while (forks.length) {
                const current = forks.pop();
                const way = current.way + 1;
                originLevel[current.row][current.column] = way;
                const neighbors = this._getNeighbors(originLevel, current, way);
                branches[current.row][current.column] = {
                    row: current.row,
                    column: current.column,
                    way: way,
                    isEnd: neighbors.length === 0,
                    crossroad: neighbors.length > 1
                        ? 0
                        : current.crossroad + 1,
                };
                neighbors.forEach(item => {
                    item.crossroad = branches[current.row][current.column].crossroad;
                });
                if (branches[current.row][current.column].isEnd) {
                    deadlocks.push(branches[current.row][current.column]);
                }
                Array.prototype.push.apply(forks, neighbors);
                if (maxDistance < way) {
                    maxDistance = way;
                    lastPoint = current;
                }
            }
            return [maxDistance, lastPoint, deadlocks];
        },

        _getNeighbors(map, current, way) {
            const top = this._getItem({ row: current.row - 1, column: current.column }, current, way);
            const left = this._getItem({ row: current.row, column: current.column + 1 }, current, way);
            const bottom = this._getItem({ row: current.row + 1, column: current.column }, current, way);
            const right = this._getItem({ row: current.row, column: current.column - 1 }, current, way);

            const neighbors = [];
            if (this._isCorrect(map, top)) neighbors.push(top);
            if (this._isCorrect(map, left)) neighbors.push(left);
            if (this._isCorrect(map, bottom)) neighbors.push(bottom);
            if (this._isCorrect(map, right)) neighbors.push(right);

            return neighbors;
        },

        _getItem(position, prev, way) {
            return {
                row: position.row,
                column: position.column,
                prev: prev,
                way: way,
                crossroad: 0,
            };
        },

        _isCorrect(map, position) {
            return (map[position.row] || [])[position.column] === 1;
        }
    };

    module.gameLevelDistance = methods;
})();
