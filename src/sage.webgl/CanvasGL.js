
sage.webgl.CanvasGL = class{
	constructor(canvasID,w,h){
		//Get access to canvas and its context
		this.canvas = document.getElementById(canvasID);
		this.gl = this.canvas.getContext("webgl") || this.mConvas.getContect("experimental-webgl");
		
		if(!this.gl){
			console.log("webgl context not available");
			return;
		}
		
		this.gl.enable(this.gl.DEPTH_TEST);		//Shouldn't use this, use something else to add depth detection
		this.gl.enable(this.gl.CULL_FACE);		//Cull back face, so only show triangles that are created clockwise
		this.gl.depthFunc(this.gl.LEQUAL);		//Near things obscure far things
		this.gl.clearColor(0.0,0.0,0.0,1.0);	//Set clear color
		this.clear();
	}

	//--------------------------------------------------------------------------
	//Methods
	clear(){ this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); }


	//--------------------------------------------------------------------------
	//Setters / Getters
	setBackgroundColor(r,g,b,a){
		this.gl.clearColor(r,g,b,a);
		return this;
	}

	//When resizing the canvas
	setSize(w,h){
		//set the size of the canvas
		this.canvas.style.width = w + "px";
		this.canvas.style.height = h + "px";
		this.canvas.width = w;
		this.canvas.height = h;
		
		//when updating the canvas size, must reset the viewport of the canvas else the resolution webgl renders at will not change
		this.gl.viewport(0,0,w,h);
		return this;
	}


	//--------------------------------------------------------------------------
	//Buffers

	unbindBuffer(){ this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null); }

	createArrayBuffer(ary,isStatic){
		if(isStatic === undefined) isStatic = true;

		var buf = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(ary), ((isStatic)?this.gl.STATIC_DRAW : this.gl.DYNAMIC_DRAW) );
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

		return buf;
	}

	updateArrayBuffer(buf,ary){
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf);
		this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(ary));
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	}

	createElmAryBuffer(ary,isStatic){
		if(isStatic === undefined) isStatic = true;
		
		var buf = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buf);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ary), ((isStatic)?this.gl.STATIC_DRAW : this.gl.DYNAMIC_DRAW) );
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null);

		return buf;
	}
}