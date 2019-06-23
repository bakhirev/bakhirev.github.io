(function () {

    const methods = {
        getLevel(height, width) {
            const visited = this.getMap(height, width);
            const stack = [{ row: 1, column: 1 }];
            while (this._step(visited, stack)) {
            }
            return visited;
        },
        getMap(height, width) {
            return Array(height).fill(0).map(() => Array(width).fill(0));
        },
        _step(visited, history) {
            if (history.length === 0) return false;
            const current = history[history.length - 1];
            visited[current.row][current.column] = 1;
            const neighbor = this._getNeighbor(visited, current.row, current.column);
            if (neighbor) {
                visited[neighbor.corridor[0]][neighbor.corridor[1]] = 1;
                history.push(neighbor);
            } else {
                history.pop();
            }
            return true;
        },
        _getNeighbor(visited, row, column) {
            const neighbors = [];
            if ((visited[row - 2] || [])[column] === 0) neighbors.push({
                row: row - 2,
                column: column,
                corridor: [row - 1, column]
            });

            if (visited[row][column + 2] === 0) neighbors.push({
                row: row,
                column: column + 2,
                corridor: [row, column + 1]
            });

            if (visited[row][column - 2] === 0) neighbors.push({
                row: row,
                column: column - 2,
                corridor: [row, column - 1]
            });

            if ((visited[row + 2] || [])[column] === 0) neighbors.push({
                row: row + 2,
                column: column,
                corridor: [row + 1, column]
            });

            if (!neighbors.length) return null;
            const index = this.random(neighbors.length - 1);
            return neighbors[index];
        },
        random(max) {
            return Math.round(Math.random() * max);
        },
        getCopy(level) {
            return level.map(row => [...row]);
        },
        print(level) {
            console.log(level.map(row => row.map(v => v ? '#' : ' ').join(' ')).join('\n'));
        },

    };

    module.level = methods;
})();
