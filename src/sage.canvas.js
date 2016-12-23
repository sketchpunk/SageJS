var sage = sage || {};

sage.Canvas = class{
	constructor(elmID){
		this.elm = document.getElementById(elmID);
		this.ctx = this.elm.getContext("2d");
		this.ctx.font = "12px serif";
		this.ctx.fillStyle ="green";
		this.ctx.strokeStyle = "rgba(255,255,255,0.25)";

		this.width = this.elm.width = this.elm.offsetWidth; //fix Weird bug where width/height don't match up well.
		this.height = this.elm.height = this.elm.offsetHeight;

		//Calculate and cache the offset x,y of the canvas, Useful to help calc mouse position in the canvas.
		var box = this.elm.getBoundingClientRect();
		this.offsetX = box.left;
		this.offsetY = box.top;
		/*
		console.log(elm.getBoundingClientRect());
		while(elm !== undefined && elm != null && elm.nodeName != "BODY"){
			console.log(elm.nodeName,elm.offsetLeft,elm.offsetTop,elm.parentNode);
			this.offsetX += elm.offsetLeft;
			this.offsetY += elm.offsetTop;
			elm = elm.parentNode;
		}
		*/
	}

	setFullScreen(){
		this.width = this.elm.width = window.innerWidth
		this.height = this.elm.height = window.innerHeight;

		var box = this.elm.getBoundingClientRect();
		this.offsetX = box.left;
		this.offsetY = box.top;

		return this;
	}

	setInitTranslate(wNorm,hNorm){ this.ctx.translate(this.width * wNorm,this.height * hNorm); return this; }

	setLine(w,style,aryDash){
		if(w !== undefined && w != null) this.ctx.lineWidth = w;
		if(style !== undefined && style != null) this.ctx.strokeStyle = style;
		if(aryDash !== undefined && aryDash != null) this.ctx.setLineDash(aryDash);
		return this;
	}
	setFill(style){
		this.ctx.fillStyle = style;
		return this;
	}

	setFont(font,style){
		this.ctx.font = font;
		this.ctx.fillStyle = style;
		return this;
	}

	getMouseVec2(e){ 
		return {x:e.pageX - this.offsetX, y:e.pageY - this.offsetY}; }

	addListener(){
		for(var i=0; i < arguments.length; i+=2) this.elm.addEventListener(arguments[i],arguments[i+1]);
		return this;
	}
	removeListener(){
		for(var i=0; i < arguments.length; i+=2) this.elm.removeEventListener(arguments[i],arguments[i+1]);
		return this;
	}

	clear(){ this.ctx.clearRect(0,0,this.width,this.height); return this; }

	circle(x,y,r,color){
		if(color !== undefined && color != null) this.ctx.fillStyle = color;

		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, Math.PI*2, false);
		this.ctx.fill();

		return this;
	}

	drawCirclePos(pos,r,color){
		if(color !== undefined && color != null) this.ctx.fillStyle = color;

		this.ctx.beginPath();
		this.ctx.arc(pos.x, pos.y, r, 0, Math.PI*2, false);
		this.ctx.fill();

		return this;
	}

	drawLine(){
		if(arguments.length < 2){
			console.log("Must send at least two positions for drawline");
			return;
		}

		this.ctx.beginPath();
		this.ctx.moveTo(arguments[0].x, arguments[0].y);

		//Optimize for only 2 pos, no point doing a loop
		if(arguments.length == 2) this.ctx.lineTo(arguments[1].x, arguments[1].y);
		else for(var i=1; i < arguments.length; i++) this.ctx.lineTo(arguments[i].x, arguments[i].y);

		this.ctx.stroke();

		return this;
	}

	drawLineRawArg(){
		this.ctx.beginPath();
		this.ctx.moveTo(arguments[0], arguments[1]);
		for(var i=2; i < arguments.length; i+=2) this.ctx.lineTo(arguments[i], arguments[i+1]);
		this.ctx.stroke();
		return this;
	}

	drawLineRawAry(ary){
		this.ctx.beginPath();
		this.ctx.moveTo(ary[0], ary[1]);
		for(var i=2; i < ary.length; i+=2) this.ctx.lineTo(ary[i], ary[i+1]);
		this.ctx.stroke();
		return this;
	}

	drawText(x,y,txt){
  		this.ctx.fillText(txt,x,y);
  		return this;
	}

	drawCircle(isStroke,x,y,r,startAng,endAng){
		this.ctx.beginPath();
		this.ctx.arc(x, y, r || 4, startAng || 0, endAng || 2*Math.PI, false);
		
		if(isStroke) this.ctx.stroke();
		else this.ctx.fill();
		return this;
	}

	drawRect(isStroke,x,y,w,h){
		this.ctx.beginPath();
		this.ctx.rect(x,y,w,h);
		
		if(isStroke) this.ctx.stroke();
		else this.ctx.fill();
		return this;
	}

	drawCurve(a,b,c,d,color){
		if(color !== undefined && color != null) this.ctx.strokeStyle = color;

		this.ctx.beginPath();
		this.ctx.moveTo(a.x, a.y);
		this.ctx.bezierCurveTo(b.x, b.y,  c.x, c.y,  d.x, d.y);
		this.ctx.stroke();
		return this;
	}

	imgRotateCenter(src,x,y,w,h,a){
		//this.ctx.save();
		this.ctx.translate(x,y);
		this.ctx.rotate(a); //Rotate canvas for drawing

		if(w && h) this.ctx.drawImage(src,-w/2,-h/2,w,h);
		else this.ctx.drawImage(src,-w/2,-h/2);

		//this.ctx.restore();
		
		this.ctx.rotate(-a); //Undo the rotation and transform 
		this.ctx.translate(-x,-y);

		return this;
	}

	img(src,x,y,w,h){
		if(w && h) this.ctx.drawImage(src,x,y,w,h);
		else this.ctx.drawImage(src,x,y);

		return this;
	}
}