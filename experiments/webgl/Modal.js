class Modal{
	constructor(meshData){
		this.transform = new Transform();
		this.meshData = meshData;
	}

	//Things to do before its time to render
	preRender(){ this.transform.updateMatrix(); }
}

class ModalMouse{
	constructor(canvas,modal){
		var oThis = this;
		var box = canvas.getBoundingClientRect();
		this.canvas = canvas;
		this.modal = modal;
		
		this.offsetX = box.left;
		this.offsetY = box.top;

		this.initX = 0;
		this.initY = 0;
		this.prevX = 0;
		this.prevY = 0;

		this.onUpHandler = function(e){ oThis.onMouseUp(e); };
		this.onMoveHandler = function(e){ oThis.onMouseMove(e); }

		this.onTouchEndHandler = function(e){ e.preventDefault(); oThis.onTouchEnd(e); }
		this.onTouchMoveHandler = function(e){ e.preventDefault(); oThis.onTouchMove(e); }

		canvas.addEventListener("mousedown",function(e){ oThis.onMouseDown(e); });
		canvas.addEventListener("mousewheel", function(e){ oThis.onMouseWheel(e); });

		canvas.addEventListener("touchstart",function(e){ e.preventDefault(); oThis.onTouchStart(e); })
	}

	getMouseVec2(e){ return {x:e.pageX - this.offsetX, y:e.pageY - this.offsetY}; }
	getTouchVec2(e){ return {x:e.changedTouches[0].pageX - this.offsetX, y:e.changedTouches[0].pageY - this.offsetY}; }

	onTouchStart(e){
		this.initX = this.prevX = e.changedTouches[0].pageX - this.offsetX;
		this.initY = this.prevY = e.changedTouches[0].pageY - this.offsetY;

		this.canvas.addEventListener("touchcancel",this.onTouchEndHandler);
		this.canvas.addEventListener("touchend",this.onTouchEndHandler);
		this.canvas.addEventListener("touchleave",this.onTouchEndHandler);
		this.canvas.addEventListener("touchmove",this.onTouchMoveHandler);
	}

	onTouchEnd(e){
		this.canvas.removeEventListener("touchcancel",this.onTouchEndHandler);
		this.canvas.removeEventListener("touchend",this.onTouchEndHandler);
		this.canvas.removeEventListener("touchleave",this.onTouchEndHandler);
		this.canvas.removeEventListener("touchmove",this.onTouchMoveHandler);
	}

	onTouchMove(e){
		e.preventDefault();
		var x = e.changedTouches[0].pageX - this.offsetX,
			y = e.changedTouches[0].pageY - this.offsetY;

		if(!e.shiftKey){
			this.modal.transform.rotation.y += (x - this.prevX) * 0.7;
			this.modal.transform.rotation.x += (y - this.prevY) * 0.3;
		}else{
			this.modal.transform.position.x += (x - this.prevX) * 0.01;
			this.modal.transform.position.y += -(y - this.prevY) * 0.01;
		}

		this.prevX = x;
		this.prevY = y;
	}


	onMouseDown(e){
		e.preventDefault();
		this.initX = this.prevX = e.pageX - this.offsetX;
		this.initY = this.prevY = e.pageY - this.offsetY;

		this.canvas.addEventListener("mouseup",this.onUpHandler);
		this.canvas.addEventListener("mousemove",this.onMoveHandler);
	}

	onMouseUp(e){
		e.preventDefault();
		this.canvas.removeEventListener("mouseup",this.onUpHandler);
		this.canvas.removeEventListener("mousemove",this.onMoveHandler);
	}

	onMouseWheel(e){
		e.preventDefault();
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		this.modal.transform.position.z += delta * 0.2;
	}

	onMouseMove(e){
		e.preventDefault();
		var x = e.pageX - this.offsetX,
			y = e.pageY - this.offsetY;

		if(!e.shiftKey){
			this.modal.transform.rotation.y += (x - this.prevX) * 0.7;
			this.modal.transform.rotation.x += (y - this.prevY) * 0.3;
		}else{
			this.modal.transform.position.x += (x - this.prevX) * 0.01;
			this.modal.transform.position.y += -(y - this.prevY) * 0.01;
		}

		this.prevX = x;
		this.prevY = y;
	}
}