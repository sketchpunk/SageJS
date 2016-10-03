


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

		// Set field of view to 45 degrees with a ratio of the canvas size
		// plus only see objects between 0.1 units and 100 units away from the camera.
		var ratio = this.mCanvas.width / this.mCanvas.height;
		this.mPerspectiveMat4 = new Float32Array(16);
		sage.webgl.Matrix4.perspective(this.mPerspectiveMat4,45,ratio,0.1,100.0);

		//Location of the camera in relation to origin.
		this.mViewMat4 = new sage.webgl.Matrix4().setTranslation(0,0,-5.0);		
	}

	clear(){
		this.mGL.clearColor(0.0,0.0,0.0,1.0);
		this.mGL.clear(this.mGL.COLOR_BUFFER_BIT | this.mGL.DEPTH_BUFFER_BIT);
	}

	getViewMatrix(){ return this.mViewMat4.raw; }
	getPerspectiveMatrix(){ return this.mPerspectiveMat4; }


	//When resizing the canvas
	setSize(w,h){
		//set the size of the canvas
		this.mCanvas.style.width = w + "px";
		this.mCanvas.style.height = h + "px";
		this.mCanvas.width = w;
		this.mCanvas.height = h;
		
		//when updating the canvas size, must reset the viewport of the canvas else the resolution webgl renders at will not change
		this.mGL.viewport(0,0,w,h);

		//Update Perspective matrix so to render things correctly.
		var ratio = this.mCanvas.width / this.mCanvas.height;
		sage.webgl.Matrix4.perspective(this.mPerspectiveMat4,45,ratio,0.1,100.0);
	}

	createBuffer(ary){
		var buf = this.mGL.createBuffer();
		this.mGL.bindBuffer(this.mGL.ARRAY_BUFFER, buf);
		this.mGL.bufferData(this.mGL.ARRAY_BUFFER, new Float32Array(ary), this.mGL.STATIC_DRAW);

		return buf;
	}
}