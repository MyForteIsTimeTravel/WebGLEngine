var canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)

var gl = canvas.getContext('webgl')
gl.clearColor(0.44, 0.2, 0.24, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)
gl.frontFace(gl.CCW)
gl.cullFace(gl.BACK)

var vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, [
    'attribute vec3 vertPos;',
    'attribute vec3 vertCol;',
    'varying vec3 fragCol;',
    'uniform mat4 model;',
    'uniform mat4 view;',
    'uniform mat4 projection;',
    'void main (void) {',
        'fragCol = vertCol;',
        'gl_Position = projection * view * model * vec4(vertPos, 1.0);',
    '}'
].join('\n'))
gl.compileShader(vertexShader)
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
}

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, [
    'precision highp float;',
    'varying vec3 fragCol;',
    'void main (void) {',
        'gl_FragColor = vec4(fragCol, 1.0);',
    '}'
].join('\n'))
gl.compileShader(fragmentShader)
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
	}

var Shader = gl.createProgram()
gl.attachShader(Shader, vertexShader)
gl.attachShader(Shader, fragmentShader)
gl.linkProgram(Shader)

var triVertices = new Float32Array ([
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.0, 0.5, 0.0
])

var boxVertices = new Float32Array ([
        // Top
		-1.0, 1.0, -1.0,   0.6, 0.2, 0.2,
		-1.0, 1.0, 1.0,    0.6, 0.2, 0.2,
		1.0, 1.0, 1.0,     0.6, 0.2, 0.2,
		1.0, 1.0, -1.0,    0.6, 0.2, 0.2,

		// Left
		-1.0, 1.0, 1.0,    0.3, 0.1, 0.3,
		-1.0, -1.0, 1.0,   0.3, 0.1, 0.3,
		-1.0, -1.0, -1.0,  0.3, 0.1, 0.3,
		-1.0, 1.0, -1.0,   0.3, 0.1, 0.3,

		// Right
		1.0, 1.0, 1.0,     0.3, 0.6, 0.5,
		1.0, -1.0, 1.0,    0.3, 0.6, 0.5,
		1.0, -1.0, -1.0,   0.3, 0.6, 0.5,
		1.0, 1.0, -1.0,    0.3, 0.6, 0.5,

		// Front
		1.0, 1.0, 1.0,    0.1, 0.2, 0.3,
		1.0, -1.0, 1.0,   0.1, 0.2, 0.3,
		-1.0, -1.0, 1.0,  0.1, 0.2, 0.3,
		-1.0, 1.0, 1.0,   0.1, 0.2, 0.3,

		// Back
		1.0, 1.0, -1.0,   0.3, 0.3, 0.2, 
		1.0, -1.0, -1.0,  0.3, 0.3, 0.2, 
		-1.0, -1.0, -1.0, 0.3, 0.3, 0.2, 
		-1.0, 1.0, -1.0,  0.3, 0.3, 0.2, 

		// Bottom
		-1.0, -1.0, -1.0, 0.1, 0.3, 0.3, 
		-1.0, -1.0, 1.0,  0.1, 0.3, 0.3, 
		1.0, -1.0, 1.0,   0.1, 0.3, 0.3, 
		1.0, -1.0, -1.0,  0.1, 0.3, 0.3
])

var boxIndices = new Uint16Array ([
    // top
    0, 1, 2,
    0, 2, 3,
    
    // Left
    5, 4, 6,
	6, 4, 7,

	// Right
	8, 9, 10,
	8, 10, 11,

	// Front
	13, 12, 14,
	15, 14, 12,

	// Back
	16, 17, 18,
	16, 18, 19,

	// Bottom
	21, 20, 22,
	22, 20, 23
])

var VBO = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, VBO)
gl.bufferData(gl.ARRAY_BUFFER, boxVertices, gl.STATIC_DRAW)

var EBO = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, boxIndices, gl.STATIC_DRAW)

// upload static shader data
var posAttribLoc = gl.getAttribLocation(Shader, 'vertPos')
var colAttribLoc = gl.getAttribLocation(Shader, 'vertCol')

gl.vertexAttribPointer(posAttribLoc, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0)
gl.vertexAttribPointer(colAttribLoc, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT)

gl.enableVertexAttribArray(posAttribLoc);
gl.enableVertexAttribArray(colAttribLoc);

gl.useProgram(Shader)

// view transform
var view  = new Float32Array(16)
var viewLoc = gl.getUniformLocation(Shader, 'view')
mat4.lookAt(view, 
    [0, 0, -5], // position 
    [0, 0, 0],  // forward
    [0, 1, 0]  // up
);
   
// projection transform
var projection = new Float32Array(16)
var projectionLoc = gl.getUniformLocation(Shader, 'projection')
mat4.perspective(projection,
    glMatrix.toRadian(60), // fov
    canvas.width / canvas.height, // aspect
    0.01, // near
    1000 // far
);
    

gl.uniformMatrix4fv(viewLoc, gl.FALSE, view)
gl.uniformMatrix4fv(projectionLoc, gl.FALSE, projection)

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
    angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    var model = new Float32Array(16)
    var xRot = new Float32Array(16)
    var zRot = new Float32Array(16)
    var modelLoc = gl.getUniformLocation(Shader, 'model')
    mat4.rotate(xRot,
        identity, // original
        angle, // angle
        [0, 1, 0]   // gain
    );
    
    mat4.rotate(zRot,
        identity, // original
        angle, // angle
        [0, 0, 1]   // gain
    );
    
    mat4.mul(model, xRot, zRot);
    
    // pass uniforms to GPU
    gl.uniformMatrix4fv(modelLoc, gl.FALSE, model)
    
    // render
    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0)
   // gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3)
    
    // see you again soon
    requestAnimationFrame(update)
}

requestAnimationFrame(update);