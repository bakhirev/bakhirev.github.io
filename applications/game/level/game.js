(function () {
    // 0..8 непроходимые обьекты
    // 9 пустой корридор
    // 10..19 вещи
    // 20..29 ловушки
    // 100 выход
    const level = require('level');
    const gameLevelParts = require('gameLevelParts');

    const methods = {
        getGameLevel(originMap, distance) {
            let gameLevel = [...originMap].map(row => row.map(code => code === 1 ? 9 : code));
            let notUsedParts = gameLevelParts.getParts(gameLevel);
            notUsedParts.sort(() => Math.random() - 0.5);

            [gameLevel, notUsedParts] = this._addRadiationInLevel(gameLevel, notUsedParts, distance.begin);
            [gameLevel, notUsedParts] = this._addTimeAnomaliesInLevel(gameLevel, notUsedParts, distance.begin);

            this._addPass(gameLevel, distance.deadlocks[0], 10); // pass
            this._addPass(gameLevel, distance.deadlocks[1], 11);
            this._addPass(gameLevel, distance.deadlocks[2], 12);

            gameLevel[distance.end.row][distance.end.column] = 100; // ends

            const [row, column] = this._getPrevPoint(gameLevel, distance.end.row, distance.end.column);
            gameLevel[row][column] = 1;

            return gameLevel;
        },
        _addPass(gameLevel, deadlock, code) {
            if (deadlock) gameLevel[deadlock.row][deadlock.column] = code;
        },
        _getPrevPoint(gameLevel, row, column) {
            if (gameLevel[row - 1][column]) return [row - 1, column];
            if (gameLevel[row + 1][column]) return [row + 1, column];
            if (gameLevel[row][column - 1]) return [row, column - 1];
            if (gameLevel[row][column + 1]) return [row, column + 1];
        },
        _addTimeAnomaliesInLevel(gameLevel, parts, respawnPoint) {
            console.dir(parts);
            const timeLimit = 4;
            let count = 0;
            const notUsedParts = parts.filter(part => {
                if (count > timeLimit
                    || part.size <= 5
                    || (respawnPoint.row === part.begin[0] && respawnPoint.column === part.begin[1])
                    || (respawnPoint.row === part.end[0] && respawnPoint.column === part.end[1])) return true;
                count += 1;
                gameLevel = this._replacePart(gameLevel, part, 20);
                return false;
            });
            return [gameLevel, notUsedParts];
        },
        _addRadiationInLevel(gameLevel, parts, respawnPoint) {
            const radiationLimit = 14;
            let radiation = 0;
            const notUsedParts = parts.filter(part => {
                if (radiation > radiationLimit
                    || (part.size < 3 || part.size > 4)
                    || (respawnPoint.row === part.begin[0] && respawnPoint.column === part.begin[1])
                    || (respawnPoint.row === part.end[0] && respawnPoint.column === part.end[1])) return true;
                radiation += part.size;
                gameLevel = this._replacePart(gameLevel, part, 21);
                return false;
            });
            return [gameLevel, notUsedParts];
        },
        _replacePart(gameLevel, part, newCode) {
            return part.type === 'vertically'
                ? this._replaceVerticallyPart(gameLevel, part, newCode)
                : this._replaceHorizontallyPart(gameLevel, part, newCode);
        },
        _replaceVerticallyPart(gameLevel, part, newCode) {
            return gameLevel.map((row, rowIndex) => {
                return (rowIndex >= part.begin[0] && rowIndex <= part.end[0])
                    ? row.map((code, columnIndex) => {
                        return (columnIndex === part.begin[1]) ? newCode : code;
                    }) : row
            });
        },
        _replaceHorizontallyPart(gameLevel, part, newCode) {
            return gameLevel.map((row, rowIndex) => {
                return rowIndex === part.begin[0]
                    ? row.map((code, columnIndex) => {
                        return (columnIndex >= part.begin[1] && columnIndex <= part.end[1]) ? newCode : code;
                    }) : row
            });
        }
    };

    module.gameLevelGame = methods;
})();
