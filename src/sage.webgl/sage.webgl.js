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

	getViewMatrix(){ return this.mViewMat4.raw; }
	getPerspectiveMatrix(){ return this.mPerspectiveMat4; }
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

	static identity(){
		var a = new Float32Array(16);
		a[0] = a[5] = a[10] = a[15] = 1;
		return a;
	}

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
}
