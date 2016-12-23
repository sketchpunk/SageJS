var sage = sage || {};
sage.math = {};

/*======================================================
Reusable Math stuff */
sage.math.randomRng = function(min,max){ return min + Math.random() * (max - min); }
sage.math.randomInt = function(min,max){  return Math.floor( min + Math.random() * (max - min + 1) ); }

sage.math.posDistance = function(x0,y0,x1,y1){
	var dx = x1 - x0, dy = y1 - y0;
	return Math.sqrt(dx*dx + dy*dy);
};

sage.math.radDeg = function(v){ return v * (180/Math.PI); }
sage.math.degRad = function(v){ return v * (Math.PI/180); }

//Constants
//sage.math.RAD360 = Math.PI * 2;
//sage.math.RAD90 = Math.PI / 2;
//sage.math.RAD45 = sage.math.RAD90/2;
//sage.math.RAD135 = sage.math.RAD90 + sage.math.RAD45;


/*======================================================
Vector 2 functionality */

sage.math.Vector2 = class{
	constructor(x,y){
		this.x = x || 0;
		this.y = y || 0; 
	}

	//=======================
	//Getters and Setters
	set(x,y){ this.x=x; this.y=y; return this;}

	getMagnitude(){ return Math.sqrt(this.x*this.x + this.y*this.y); }
	setMagnitude(mag){
		var angle = this.getAngle();
		this.x = Math.cos(angle) * mag;
		this.y = Math.sin(angle) * mag;
	}

	getAngle(vec){
		if(vec) return Math.atan2(this.y-vec.y,this.x-vec.x);
		return Math.atan2(this.y,this.x);
	}
	setAngle(angle){
		var mag = this.getMagnitude();
		this.x = Math.cos(angle) * mag;
		this.y = Math.sin(angle) * mag;
	}

	//=======================
	//Math operations
	addNewXY(x,y)		{ return new sage.math.Vector2(this.x + x, this.y - y); }
	subtractNewXY(x,y)	{ return new sage.math.Vector2(this.x - x, this.y - y); }

	addNew(v)		{ return new sage.math.Vector2(this.x + v.x, this.y - v.y); }
	subtractNew(v)	{ return new sage.math.Vector2(this.x - v.x, this.y - v.y); }
	multiplyNew(v)	{ return new sage.math.Vector2(this.x * v.x, this.y * v.y); }
	divideNew(v)	{ return new sage.math.Vector2(this.x / v.x, this.y . v.y); }

	add(v)			{ this.x += v.x; this.y += v.y; return this; }
	subtract(v)		{ this.x -= v.x; this.y -= v.y; return this; }
	multiply(v)		{ this.x *= v.x; this.y *= v.y; return this; }
	divide(v)		{ this.x /= v.x; this.y /= v.y; return this; }

	multiScalar(v)	{ this.x *= v; this.y *= v; return this;}

	normalize()		{ var mag = this.getMagnitude(); this.x /= mag; this.y /= mag; return this;}

	//=======================
	//Static Methods
	static identity(){ return new sage.math.Vector2(1,1); }
}

/*======================================================
Simple Collision Detection */
sage.math.Collision = class{
	static circles(c0,c1){ return (sage.math.posDistance(c0.pos.x,c0.pos.y,c1.pos.x,c1.pos.y) <= c0.radius+c1.radius); }

	static circleRectBound(c,w,h){
		var pos = 0;

		if(c.pos.x - c.radius <= 0) pos += 1;	//Left Wall
		if(c.pos.y - c.radius <= 0) pos += 2;	//Top Wall
		if(c.pos.x + c.radius >= w) pos += 4;	//Right Wall
		if(c.pos.y + c.radius >= h) pos += 8;	//Bottom Wall
		
		return pos;
	}

	static circlePoint(cr,cx,cy,px,py){ return (sage.math.posDistance(cx,cy,px,py) <= cr); }

	
	//,inRange: function(v,min,max){ return v >= Math.min(min,max) && v <= Math.max(min,max); }
	//,pointInRect: function(x,y,rect){ return utils.inRange(x,rect.x,rect.x + rect.width) && utils.inRange(y,rect.y,rect.y + rect.height); }

};


/*======================================================
Simple Shapes */
sage.math.Circle = class{
	constructor(x,y,r){
		this.pos = new sage.math.Vector2(x,y);
		this.radius = r;
	}

	draw(c){ c.circle(this.pos.x,this.pos.y,this.radius); }
}
