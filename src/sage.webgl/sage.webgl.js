var sage = sage || {};
sage.webgl = sage.webgl || {};

/**
 * Documentation sample 
 *
 * @param  VAR1
 * @param  var2
 * @return 
 */

//##############################################################################
sage.webgl.Vector3 = class{
	constructor(x,y,z){
		this.x = x || 0.0;
		this.y = y || 0.0;
		this.z = z || 0.0;	
	}

	getArray(){ return [this.x,this.y,this.z]; }
	clone(){ return new sage.webgl.Vector3(this.x,this.y,this.z); }
}


//##############################################################################
sage.webgl.Mesh = class{
	constructor(ary,cgl){
		this.mVertices = ary;
		this.position = new sage.webgl.Vector3();
		this.buffer = cgl.createBuffer(ary);
	}

	getVerticeCount(){ return this.mVertices.length / 3; }

	draw(cgl){
		cgl.mGL.drawArrays(cgl.mGL.TRIANGLE_STRIP,0,this.getVerticeCount()); //Draw mesh
	}
}


//##############################################################################
sage.webgl.Camera = class{
	constructor(){
		this.mPerspectiveMat4	= new Float32Array(16);
		this.mPosition			= new sage.webgl.Vector3();
		this.mViewMat4			= new sage.webgl.Matrix4().setTransVec3(this.mPosition);
		this.mRotation			= new sage.webgl.Vector3(0,0,0);		
	}

	setPerspective(fovy,ratio,near,far){
		sage.webgl.Matrix4.perspective(this.mPerspectiveMat4,fovy,ratio,near,far);
		return this;
	}

	setPosition(x,y,z){
		this.mPosition.x = x;
		this.mPosition.y = y;
		this.mPosition.z = z;
		this.mViewMat4.setTranslation(x,y,z);
		return this;
	}

	getPerspectiveMatrix(){ return this.mPerspectiveMat4; }
	getViewMatrix(){
		return this.mViewMat4.raw;
	}

	rotateY(angle){
		var rad = angle * Math.PI / 180.0;
		this.mViewMat4.rotateY(rad);
		//sage.webgl.Matrix4.rotate(this.mViewMat4.raw,rad,[0,1,0]);
		return this;
	}
}

//##############################################################################
sage.webgl.RenderLoop = class{
	constructor(callback){
		this.mDTLastFrame = null;
		this.mCallBack = callback;
		this.isActive = false;

		var oThis = this;
		this.run = function(){
			var dtNow = Date.now();
			var delta = (oThis.mDTLastFrame != null)? (dtNow - oThis.mDTLastFrame) / 1000.0 : 0;
			oThis.mDTLastFrame = dtNow;

			oThis.mCallBack(delta);

			if(oThis.isActive) window.requestAnimationFrame(oThis.run);
		}
	}

	start(){
		this.isActive = true;
		window.requestAnimationFrame(this.run);
	}

	stop(){ this.isActive = false; }
}


//##############################################################################
sage.webgl.Matrix4 = class{
	constructor(){ this.raw = sage.webgl.Matrix4.identity(); }

	setTransVec3(vec3){
		this.raw[12] = vec3.x;
		this.raw[13] = vec3.y;
		this.raw[14] = vec3.z;
		return this;
	}
	setTranslation(x,y,z){
		this.raw[12] = x;
		this.raw[13] = y;
		this.raw[14] = z;
		return this;
	}

	rotateY(rad){
		sage.webgl.Matrix4.rotateY(this.raw,rad);
		return this;
	}

	static identity(){
		var a = new Float32Array(16);
		a[0] = a[5] = a[10] = a[15] = 1;
		return a;
	}

	//from glMatrix
	static perspective(out, fovy, aspect, near, far){
		var f = 1.0 / Math.tan(fovy / 2),
			nf = 1 / (near - far);
	    out[0] = f / aspect;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = f;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = (2 * far * near) * nf;
	    out[15] = 0;
	}

	//From glMatrix
	static mult(out, a, b){
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

	    // Cache only the current line of the second matrix
	    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
	    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

	    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
	    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

	    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
	    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

	    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
	    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
	    return out;	
	}

	static rotateY(out,rad) {
		var s = Math.sin(rad),
			c = Math.cos(rad),
			a00 = out[0],
			a01 = out[1],
			a02 = out[2],
			a03 = out[3],
			a20 = out[8],
			a21 = out[9],
			a22 = out[10],
			a23 = out[11];

		// Perform axis-specific matrix multiplication
		out[0] = a00 * c - a20 * s;
		out[1] = a01 * c - a21 * s;
		out[2] = a02 * c - a22 * s;
		out[3] = a03 * c - a23 * s;
		out[8] = a00 * s + a20 * c;
		out[9] = a01 * s + a21 * c;
		out[10] = a02 * s + a22 * c;
		out[11] = a03 * s + a23 * c;
		return out;
	};

	static rotate (out, rad, axis){
		var x = axis[0], y = axis[1], z = axis[2],
			len = Math.sqrt(x * x + y * y + z * z),
			s, c, t,
			a00, a01, a02, a03,
			a10, a11, a12, a13,
			a20, a21, a22, a23,
			b00, b01, b02,
			b10, b11, b12,
			b20, b21, b22;

		if (Math.abs(len) < 0.000001) { return null; }

		len = 1 / len;
		x *= len;
		y *= len;
		z *= len;

		s = Math.sin(rad);
		c = Math.cos(rad);
		t = 1 - c;

		a00 = out[0]; a01 = out[1]; a02 = out[2]; a03 = out[3];
		a10 = out[4]; a11 = out[5]; a12 = out[6]; a13 = out[7];
		a20 = out[8]; a21 = out[9]; a22 = out[10]; a23 = out[11];

		// Construct the elements of the rotation matrix
		b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
		b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
		b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

		// Perform rotation-specific matrix multiplication
		out[0] = a00 * b00 + a10 * b01 + a20 * b02;
		out[1] = a01 * b00 + a11 * b01 + a21 * b02;
		out[2] = a02 * b00 + a12 * b01 + a22 * b02;
		out[3] = a03 * b00 + a13 * b01 + a23 * b02;
		out[4] = a00 * b10 + a10 * b11 + a20 * b12;
		out[5] = a01 * b10 + a11 * b11 + a21 * b12;
		out[6] = a02 * b10 + a12 * b11 + a22 * b12;
		out[7] = a03 * b10 + a13 * b11 + a23 * b12;
		out[8] = a00 * b20 + a10 * b21 + a20 * b22;
		out[9] = a01 * b20 + a11 * b21 + a21 * b22;
		out[10] = a02 * b20 + a12 * b21 + a22 * b22;
		out[11] = a03 * b20 + a13 * b21 + a23 * b22;
	}
}
