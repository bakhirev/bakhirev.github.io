(function() {

    const methods = {
        createShaderProgram(context, vertexShader, fragmentShader) {
            const shaderProgram = context.createProgram();
            context.attachShader(shaderProgram, vertexShader);
            context.attachShader(shaderProgram, fragmentShader);
            context.linkProgram(shaderProgram);
            return shaderProgram;
        },

        getCompileShader(context, type, source) {
            const shader = context.createShader(type);
            context.shaderSource(shader, source);
            context.compileShader(shader);
            return shader;
        },

        setBlendMode(context) {
            context.viewport(0, 0, context.drawingBufferWidth, context.drawingBufferHeight);
            context.clearColor(0, 0, 0, 0);
            context.enable(context.DEPTH_TEST);
            context.depthFunc(context.LESS);
            context.enable(context.BLEND);
            context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
        },

        clear(context) {
            context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
        },

        setTexture(context, image) {
            const texture = context.createTexture();
            context.bindTexture(context.TEXTURE_2D, texture);
            context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
            context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
            context.bindTexture(context.TEXTURE_2D, null);
            return texture;
        }
    };

    module.webGlCommon = methods;
})();

