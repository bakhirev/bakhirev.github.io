(function () {

    const methods = {
        getParts(level) {
            const response = [].concat(
                this._getHorizontallyParts(level),
                this._getVerticallyParts(level)
            );
            response.sort((a, b) => (b.size - a.size));
            return response;
        },
        _getHorizontallyParts(level) {
            const parts = [];
            level.forEach((row, rowIndex) => {
                let hasPart = false;
                let info = null;
                row.forEach((value, columnIndex) => {
                    const nextValue = level[rowIndex][columnIndex + 1];
                    if (value === 9 && nextValue === 9 && !hasPart) {
                        hasPart = true;
                        const beginShift = this._getHorizontallyShift(level, rowIndex, columnIndex);
                        info = { begin: [rowIndex, columnIndex + beginShift] };
                    }
                    if (value === 9 && nextValue !== 9 && hasPart) {
                        hasPart = false;
                        this._updateHorizontallyEndData(level, rowIndex, columnIndex, info);
                        parts.push(info);
                    }
                });
            });
            return parts;
        },
        _updateHorizontallyEndData(level, rowIndex, columnIndex, info) {
            const endShift = this._getHorizontallyShift(level, rowIndex, columnIndex);
            info.end = [rowIndex, columnIndex - endShift];
            info.size = info.end[1] - info.begin[1] + 1;
            info.type = 'horizontally';
        },
        _getHorizontallyShift(level, rowIndex, columnIndex) {
            const hasNeighbors = level[rowIndex - 1][columnIndex] === 9
                && level[rowIndex + 1][columnIndex] === 9;
            return hasNeighbors ? 1 : 0;
        },
        _getVerticallyParts(level) {
            const parts = [];
            level[0].forEach((column, columnIndex) => {
                let hasPart = false;
                let info = null;
                level.forEach((row, rowIndex) => {
                    const value = level[rowIndex][columnIndex];
                    const nextValue = (level[rowIndex + 1] || [])[columnIndex];
                    if (value === 9 && nextValue === 9 && !hasPart) {
                        hasPart = true;
                        const beginShift = this._getVerticallyShift(level, rowIndex, columnIndex);
                        info = { begin: [rowIndex + beginShift, columnIndex] };
                    }
                    if (value === 9 && nextValue !== 9 && hasPart) {
                        hasPart = false;
                        this._updateVerticallyEndData(level, rowIndex, columnIndex, info);
                        parts.push(info);
                    }
                });
            });
            return parts;
        },
        _updateVerticallyEndData(level, rowIndex, columnIndex, info) {
            const endShift = this._getVerticallyShift(level, rowIndex, columnIndex);
            info.end = [rowIndex - endShift, columnIndex];
            info.size = info.end[0] - info.begin[0] + 1;
            info.type = 'vertically';
        },
        _getVerticallyShift(level, rowIndex, columnIndex) {
            const hasNeighbors = level[rowIndex][columnIndex - 1] === 9
                && level[rowIndex][columnIndex + 1] === 9;
            return hasNeighbors ? 1 : 0;
        }
    };

    module.gameLevelParts = methods;
})();
