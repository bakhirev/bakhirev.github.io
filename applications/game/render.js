(function() {

    const webGlCommon = require('webGlCommon');
    const webGlShaders = require('webGlShaders');
    const webGlRender = require('webGlRender');
    const webGlPoints = require('webGlPoints');
    const webGlMatrix = require('webGlMatrix');
    const webGlMap = require('webGlMap');

    class Render {
        constructor(element, images) {
            this.element = element;
            this._shaders = null;
            this._context = null;
            this._textures = [];
            this._textureBuffer = null;
            this._vertexBuffer = null;
            this._normalBuffer = null;
            this._fieldOfViewInRadians = 20;
            this._dFieldOfViewInRadians = 0.05;
            this._size = {};
            this._cache = null;

            this.resize();
            this._setContext();
            this._setShaders();
            this._setBuffers();
            this._setTextures(images);
        }

        _setContext() {
            this._context = this.element.getContext('webgl', {
                premultipliedAlpha: true,
                alpha: true
            });
            webGlCommon.setBlendMode(this._context);
        }

        _setShaders() {
            this._shaders = webGlShaders.getShaders(this._context);
            this._context.useProgram(this._shaders.program);
        }

        _setBuffers() {
            this._textureBuffer = this._context.createBuffer();
            this._vertexBuffer = this._context.createBuffer();
            this._normalBuffer = this._context.createBuffer();
        }

        _setTextures(images) {
            this._textures = images.map(image => webGlCommon.setTexture(this._context, image));
            this._textures.forEach((texture, index) => {
                if (index >= 8) return;
                this._context.activeTexture(this._context[`TEXTURE${index}`]);
                this._context.bindTexture(this._context.TEXTURE_2D, texture);
            });
        }

        resize() {
            const fullSize = document.body.getBoundingClientRect();
            this.element.setAttribute('width', fullSize.width);
            this.element.setAttribute('height', fullSize.height);
            this._size = fullSize;
        }

        clearCash() {
            this._cache = null;
        }

        render(levelGame, cameraPosition, mode) {
            webGlCommon.clear(this._context);
            this._updateMatrixes(cameraPosition, mode);
            if (!this._cache) {
                this._cache = webGlMap.getElements(levelGame);
            }
            this._cache.forEach(element => {
                const numberOfRectangle = this._addPointsInBuffer(element);
                this._context.drawArrays(this._context.TRIANGLES, 0, numberOfRectangle);
            });
        }

        _updateMatrixes(cameraPosition, mode) {
            const perspectiveMatrix = this._getPerspectiveMatrix(mode);

            let cameraMatrix = this._getDefaultLookAtMatrix(cameraPosition);
            cameraMatrix = this._changeMatrix(cameraMatrix, cameraPosition);

            const viewMatrix = webGlMatrix.inverse(cameraMatrix);
            const viewProjectionMatrix = webGlMatrix.multiply(perspectiveMatrix, viewMatrix);

            this._context.uniformMatrix4fv(this._shaders.matrix, false, viewProjectionMatrix);
        }

        _getPerspectiveMatrix(mode) {
            this._updateFieldOfViewInRadians(mode);
            const fieldOfViewInRadians = this._fieldOfViewInRadians;
            const aspect = this._size.width / this._size.height;
            const near = 1;
            const far = 1000;
            return webGlMatrix.perspective(fieldOfViewInRadians, aspect, near, far);
        }

        _updateFieldOfViewInRadians(mode) {
            let normal = 20;
            if (mode === 'time') normal = 21.1;
            if (mode === 'samosbor_min') normal = 20.7;
            if (mode === 'samosbor_max') normal = 21.1;
            if (this._fieldOfViewInRadians < normal) this._fieldOfViewInRadians += this._dFieldOfViewInRadians;
            if (this._fieldOfViewInRadians > normal) this._fieldOfViewInRadians -= this._dFieldOfViewInRadians;
        }

        _getDefaultLookAtMatrix(position) {
            const cameraTarget = [position.move[0], 25, position.move[2] - 1];
            const cameraPosition = [position.move[0], 25, position.move[2]];
            const up = [0, 1, 0];
            return webGlMatrix.lookAt(cameraPosition, cameraTarget, up);
        }

        _changeMatrix(matrix, position) {
            // matrix = webGlMatrix.translate(matrix, position.move[0], position.move[1], position.move[2]);
            matrix = webGlMatrix.xRotate(matrix, position.rotate[0]);
            matrix = webGlMatrix.yRotate(matrix, position.rotate[1]);
            matrix = webGlMatrix.zRotate(matrix, position.rotate[2]);
            return matrix;
        }

        _addPointsInBuffer(element) {
            const context = this._context;

            context.bindBuffer(context.ARRAY_BUFFER, this._vertexBuffer);
            context.bufferData(context.ARRAY_BUFFER, new Float32Array(element.points), context.STATIC_DRAW);
            context.vertexAttribPointer(this._shaders.vertexPositionAttribute, 3, context.FLOAT, false, 0, 0);

            context.bindBuffer(context.ARRAY_BUFFER, this._textureBuffer);
            context.bufferData(context.ARRAY_BUFFER, new Float32Array(element.textures), context.STATIC_DRAW);
            context.vertexAttribPointer(this._shaders.vertexTextureAttribute, 2, context.FLOAT, true, 0, 0);

            context.bindBuffer(context.ARRAY_BUFFER, this._normalBuffer);
            context.bufferData(context.ARRAY_BUFFER, new Float32Array(element.normals), context.STATIC_DRAW);
            context.vertexAttribPointer(this._shaders.vertexNormalAttribute, 3, context.FLOAT, false, 0, 0);

            context.uniform1i(this._shaders.samplerUniformLocation, element.textureIndex);

            return (element.points.length / 3); // numberOfRectangle
        }
    }

    module.exports = Render;
})();
