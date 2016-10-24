
sage.webgl.CanvasGL = class{
	constructor(canvasID){
		//Get access to canvas and its context
		this.mCanvas = document.getElementById(canvasID);
		this.mGL = this.mCanvas.getContext("webgl") || this.mConvas.getContect("experimental-webgl");
		
		if(!this.mGL){
			console.log("webgl context not available");
			return;
		}
		
		this.mGL.enable(this.mGL.DEPTH_TEST); //Shouldn't use this, use something else to add depth detection
		this.mGL.depthFunc(this.mGL.LEQUAL); // Near things obscure far things
		this.clear();
	}

	clear(){
		this.mGL.clearColor(0.0,0.0,0.0,1.0);
		this.mGL.clear(this.mGL.COLOR_BUFFER_BIT | this.mGL.DEPTH_BUFFER_BIT);
	}


	//When resizing the canvas
	setSize(w,h){
		//set the size of the canvas
		this.mCanvas.style.width = w + "px";
		this.mCanvas.style.height = h + "px";
		this.mCanvas.width = w;
		this.mCanvas.height = h;
		
		//when updating the canvas size, must reset the viewport of the canvas else the resolution webgl renders at will not change
		this.mGL.viewport(0,0,w,h);
	}

	createBuffer(ary){
		var buf = this.mGL.createBuffer();
		this.mGL.bindBuffer(this.mGL.ARRAY_BUFFER, buf);
		this.mGL.bufferData(this.mGL.ARRAY_BUFFER, new Float32Array(ary), this.mGL.STATIC_DRAW);

		return buf;
	}
	createElmAryBuffer(ary){
		var buf = this.mGL.createBuffer();
		this.mGL.bindBuffer(this.mGL.ELEMENT_ARRAY_BUFFER, buf);
		this.mGL.bufferData(this.mGL.ELEMENT_ARRAY_BUFFER, new Uint16Array(ary), this.mGL.STATIC_DRAW);

		return buf;
	}
}