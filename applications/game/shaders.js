(function() {

    const webGlCommon = require('webGlCommon');

    const methods = {
        getShaders(context) {
            const vertexShader = this._getVertexShader(context);
            const fragmentShader = this._getFragmentShader(context);

            const shaderProgram = webGlCommon.createShaderProgram(context, vertexShader, fragmentShader);

            const vertexPositionAttribute = context.getAttribLocation(shaderProgram, 'a_position');
            context.enableVertexAttribArray(vertexPositionAttribute);

            const vertexTextureAttribute = context.getAttribLocation(shaderProgram, 'a_texture');
            context.enableVertexAttribArray(vertexTextureAttribute);

            const vertexNormalAttribute = context.getAttribLocation(shaderProgram, 'a_normal');
            context.enableVertexAttribArray(vertexNormalAttribute);

            const matrixUniformLocation = context.getUniformLocation(shaderProgram, 'u_matrix');
            const samplerUniformLocation = context.getUniformLocation(shaderProgram, 'u_sampler');

            return {
                program: shaderProgram,
                vertexPositionAttribute: vertexPositionAttribute,
                vertexTextureAttribute: vertexTextureAttribute,
                vertexNormalAttribute: vertexNormalAttribute,
                samplerUniformLocation: samplerUniformLocation,
                matrix: matrixUniformLocation
            };
        },

        _getVertexShader(context) {
            const code = this.getVertexShader();
            return webGlCommon.getCompileShader(context, context.VERTEX_SHADER, code);
        },

        _getFragmentShader(context) {
            const code = this.getFragmentShader();
            return webGlCommon.getCompileShader(context, context.FRAGMENT_SHADER, code);
        },

        getVertexShader() {
            return [
                'attribute vec4 a_position;',
                'attribute vec2 a_texture;',
                'attribute vec3 a_normal;',
                'uniform mat4 u_matrix;',
                'varying vec3 v_normal;',
                'varying vec2 v_texture;',
                'varying vec4 v_position;',
                'varying mat4 v_matrix;',
                'void main(void) {',
                '  v_texture = a_texture;',
                '  v_normal = a_normal;',
                '  v_position = u_matrix * a_position;',
                '  v_matrix = u_matrix;',
                '  gl_Position = v_position;',
                '}'
            ].join('');
        },

        getFragmentShader() {
            return [
                'precision mediump float;',
                'uniform sampler2D u_sampler;',
                'varying vec2 v_texture;',
                'varying vec3 v_normal;',
                'varying vec4 v_position;',
                'varying mat4 v_matrix;',

                'vec3 getAmbient(vec3 sunnyColor, float ambientStrength) {',
                '  return sunnyColor * ambientStrength;',
                '}',

                'vec3 getDiffuse(vec3 sunnyColor, vec3 lightDirection, vec3 v_normal) {',
                '  float strength = 0.6;',
                '  float diff = max(dot(v_normal, lightDirection), 0.0) * strength;',
                '  return sunnyColor * diff;',
                '}',

                'vec3 getSpecular(vec3 sunnyColor, vec3 lightDirection, vec3 v_normal) {',
                '  float specularStrength = 0.3;', // блики (не работают)
                '  vec3 viewDirection = vec3(0.2, 0.3, 0.5);',
                '  vec3 reflectDirection = reflect(-lightDirection, v_normal);',
                '  float spec = max(dot(viewDirection, reflectDirection), 0.0);',
                '  return spec * sunnyColor;',
                '}',

                'vec3 addFog(vec4 v_position, vec3 originalColor) {',
                '  vec3 fogColor = vec3(0.0, 0.0, 0.0);', // туман (нахуя?)
                '  float fogNear = 0.0;',
                // '  float fogFar = 950.0;',
                '  float fogFar = 350.0;',
                '  float fogDepth = v_position.z;',
                '  float fogAmount = smoothstep(fogNear, fogFar, fogDepth);',
                '  return originalColor + (fogColor - originalColor) * fogAmount;',
                '}',

                'void main(void) {',
                '  vec4 textureColor = texture2D(u_sampler, v_texture);',
                '  vec3 sunnyColor = vec3(0.9, 0.6, 0.3);',
                // '  vec3 sunnyColor = vec3(0.6, 0.9, 0.3);',

                '  float ambientStrength = 0.5;', // фоновое освещение
                '  vec3 ambient = getAmbient(sunnyColor, ambientStrength);',
                '  vec3 lightDirection = vec3(0.5, 0.3, 0.5);',
                '  vec3 diffuse = getDiffuse(sunnyColor, lightDirection, v_normal);',
                '  vec3 specular = getSpecular(sunnyColor, lightDirection, v_normal);',

                '  vec3 originalColor = (ambient + diffuse + specular) * textureColor.rgb;',
                // '  vec3 originalColor = ambient * textureColor.rgb;',
                '  vec3 total = addFog(v_position, originalColor);',

                // '  if(total.r < 0.2) discard;',
                // '  else gl_FragColor = vec4(total.rgb, textureColor.a);',

                '  gl_FragColor = vec4(total.rgb, textureColor.a);',
                '}'
            ].join('');
        }
    };

    module.webGlShaders = methods;
})();

