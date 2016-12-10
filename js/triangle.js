var canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)

var gl = canvas.getContext('webgl')
gl.clearColor(0.44, 0.2, 0.14, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

var vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, [
    'attribute vec3 position;',
    'uniform mat4 model;',
    'uniform mat4 view;',
    'uniform mat4 projection;',
    'void main (void) {',
        'gl_Position = projection * view * model * vec4(position, 1.0);',
    '}'
].join('\n'))
gl.compileShader(vertexShader)

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, [
    'precision highp float;',
    'uniform vec4 color;',
    'void main (void) {',
        'gl_FragColor = color;',
    '}'
].join('\n'))
gl.compileShader(fragmentShader)

var Shader = gl.createProgram()
gl.attachShader(Shader, vertexShader)
gl.attachShader(Shader, fragmentShader)
gl.linkProgram(Shader)

var vertices = new Float32Array ([
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.0, 0.5, 0.0
])

var buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

// upload static shader data
gl.useProgram(Shader)
Shader.color = gl.getUniformLocation(Shader, 'color')
gl.uniform4fv(Shader.color, [1, 0.2, 0.2, 1.0])

Shader.position = gl.getAttribLocation(Shader, 'position')
gl.enableVertexAttribArray(Shader.position)
gl.vertexAttribPointer(Shader.position, 3, gl.FLOAT, false, 0, 0)

// LOOP
var identity = new Float32Array(16)
var angle = 0;

mat4.identity(identity)
function update () {
    // clear
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    // bind shader
    gl.useProgram(Shader)
    
    // model transform
    angle = performance.now() / 1000 / 3 * 8 * Math.PI;
    var model = new Float32Array(16)
    var modelLoc = gl.getUniformLocation(Shader, 'model')
    mat4.rotate(model,
        identity, // original
        angle, // angle
        [0, 1, 0]   // gain
    );
    
    // view transform
    var view  = new Float32Array(16)
    var viewLoc = gl.getUniformLocation(Shader, 'view')
    mat4.lookAt(view, 
        [0, 0, -2], // position 
        [0, 0, 0],  // forward
        [0, 1, 0],  // up
    );
   
    // projection transform
    var projection = new Float32Array(16)
    var projectionLoc = gl.getUniformLocation(Shader, 'projection')
    mat4.perspective(projection,
        glMatrix.toRadian(60), // fov
        canvas.width / canvas.height, // aspect
        0.01, // near
        1000, // far
    );
    
    // pass uniforms to GPU
    gl.uniformMatrix4fv(modelLoc, gl.FALSE, model)
    gl.uniformMatrix4fv(viewLoc, gl.FALSE, view)
    gl.uniformMatrix4fv(projectionLoc, gl.FALSE, projection)
    
    // render
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3)
    
    // see you again soon
    requestAnimationFrame(update)
}

requestAnimationFrame(update);