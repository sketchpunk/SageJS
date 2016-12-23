function GLInstance(canvasID){
	//...................................................
	var canvas = document.getElementById(canvasID),
		gl = canvas.getContext("webgl2") ;//|| canvas.getContect("experimental-webgl");

	if(!gl){
		console.error("WebGL context is not available.");
		return null;
	}

	//gl.vao = gl.getExtension ("OES_vertex_array_object");
	//if(!gl.vao){
	//	console.error ("No support for WebGL VAO extension");
	//	return null;
	//}


	//...................................................
	//Setup GL
	gl.cullFace(gl.BACK);			//Back is also default
	gl.frontFace(gl.CCW);			//Dont really need to set it, its ccw by default.
	gl.enable(gl.DEPTH_TEST);		//Shouldn't use this, use something else to add depth detection
	gl.enable(gl.CULL_FACE);		//Cull back face, so only show triangles that are created clockwise
	gl.depthFunc(gl.LEQUAL);		//Near things obscure far things
	gl.clearColor(0.0,0.0,0.0,1.0);	//Set clear color


	//--------------------------------------------------------------------------
	//Misc Methods
	gl.fClear = function(){ this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT); return this; }

	//--------------------------------------------------------------------------
	//Setters Getters
	gl.fSetBackgroundColor = function(r,g,b,a){ this.clearColor(r,g,b,a); return this; }

	//When resizing the canvas
	gl.fSetSize = function(w,h){
		//set the size of the canvas
		this.canvas.style.width = w + "px";
		this.canvas.style.height = h + "px";
		this.canvas.width = w;
		this.canvas.height = h;

		//when updating the canvas size, must reset the viewport of the canvas else the resolution webgl renders at will not change
		this.viewport(0,0,w,h);
		return this;
	}


	//--------------------------------------------------------------------------
	//Buffers
	gl.fUnbindBuffer = function(){ this.bindBuffer(this.gl.ARRAY_BUFFER,null); }

	gl.fCreateArrayBuffer = function(ary,isStatic){
		if(isStatic === undefined) isStatic = true;

		var buf = this.createBuffer();
		this.bindBuffer(this.ARRAY_BUFFER, buf);
		this.bufferData(this.ARRAY_BUFFER, new Float32Array(ary), ((isStatic)?this.STATIC_DRAW : this.DYNAMIC_DRAW) );
		this.bindBuffer(this.ARRAY_BUFFER, null);
		return buf;
	}

	gl.fUpdateArrayBuffer = function(buf,ary){
		this.bindBuffer(this.gl.ARRAY_BUFFER, buf);
		this.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(ary));
		this.bindBuffer(this.gl.ARRAY_BUFFER, null);
	}

	gl.fCreateElmAryBuffer = function(ary,isStatic){
		if(isStatic === undefined) isStatic = true;
		
		var buf = this.gl.createBuffer();
		this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, buf);
		this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(ary), ((isStatic)?this.STATIC_DRAW : this.DYNAMIC_DRAW) );
		this.bindBuffer(this.ARRAY_BUFFER,null);
		return buf;
	}

	//--------------------------------------------------------------------------
	return gl;
}