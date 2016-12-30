class Camera{
	constructor(gl,fov,near,far){
		//Setup the perspective matrix
		this.projectionMatrix = new Float32Array(16);
		var ratio = gl.canvas.width / gl.canvas.height;
		Matrix4.perspective(this.projectionMatrix,fov,ratio,near,far);

		//Setup transform to control the position of the camera
		this.transform = new Transform();

		//Cache the matrix that will hold the inverse of the transform.
		this.viewMatrix = new Float32Array(16);
	}

	updateViewMatrix(){
		Matrix4.invert(this.viewMatrix,this.transform.updateMatrix());
		return this.viewMatrix;
	}
}


class MouseCamera{
	constructor(canvas,camera){
		var oThis = this;
		var box = canvas.getBoundingClientRect();
		this.canvas = canvas;
		this.camera = camera;
		
		this.offsetX = box.left;
		this.offsetY = box.top;

		this.initX = 0;
		this.initY = 0;
		this.prevX = 0;
		this.prevY = 0;

		this.onUpHandler = function(e){ oThis.onMouseUp(e); };
		this.onMoveHandler = function(e){ oThis.onMouseMove(e); }

		canvas.addEventListener("mousedown",function(e){ oThis.onMouseDown(e); });
		canvas.addEventListener("mousewheel", function(e){ oThis.onMouseWheel(e); });
	}

	getMouseVec2(e){ return {x:e.pageX - this.offsetX, y:e.pageY - this.offsetY}; }

	onMouseDown(e){
		this.initX = this.prevX = e.pageX - this.offsetX;
		this.initY = this.prevY = e.pageY - this.offsetY;

		this.canvas.addEventListener("mouseup",this.onUpHandler);
		this.canvas.addEventListener("mousemove",this.onMoveHandler);
	}

	onMouseUp(e){
		this.canvas.removeEventListener("mouseup",this.onUpHandler);
		this.canvas.removeEventListener("mousemove",this.onMoveHandler);
	}

	onMouseWheel(e){
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		this.camera.transform.position.z += delta * 0.2;

		//gl.fClear();
		//shader.setCameraMatrix(camera.updateViewMatrix());
	}

	onMouseMove(e){
		var x = e.pageX - this.offsetX,
			y = e.pageY - this.offsetY;
		//console.log(x - this.prevX, y - this.prevY,e.shiftKey);

		if(!e.shiftKey){
			this.camera.transform.rotation.y += (x - this.prevX) * 0.13;
			this.camera.transform.rotation.x += (y - this.prevY) * 0.13;
		}else{
			this.camera.transform.position.x += -(x - this.prevX) * 0.01;
			this.camera.transform.position.y += (y - this.prevY) * 0.01;
		}

		//gl.fClear();
		//shader.setCameraMatrix(camera.updateViewMatrix());
		//cube.render();

		this.prevX = x;
		this.prevY = y;
	}
}