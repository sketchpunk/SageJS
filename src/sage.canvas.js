var sage = sage || {};

sage.Canvas = class{
	constructor(elmID){
		this.elm = document.getElementById(elmID);
		this.ctx = this.elm.getContext("2d");
		this.width = this.elm.width = this.elm.offsetWidth; //fix Weird bug where width/height don't match up well.
		this.height = this.elm.height = this.elm.offsetHeight;
	}

	clear(){ this.ctx.clearRect(0,0,this.width,this.height); }

	circle(x,y,r,color){
		if(color !== undefined && color != null) this.ctx.fillStyle = color;

		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, sage.math.RAD360, false);
		this.ctx.fill();
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
	}

	img(src,x,y,w,h){
		if(w && h) this.ctx.drawImage(src,x,y,w,h);
		else this.ctx.drawImage(src,x,y);
	}
}