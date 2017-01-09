class Transform{
	constructor(){
		//transform vectors
		this.position	= new Vector3(0,0,0);
		this.scale		= new Vector3(1,1,1);
		this.rotation	= new Vector3(0,0,0);  //TODO, This needs to be bound to -360 to 360
		this.matView 	= new Matrix4();
		this.matNormal	= new Float32Array(9);	//This is a Mat3, No object needed for what it's used for, so a raw array to hold the values is enough.

		//Direction Vectors
		this.forward	= new Float32Array(4);
		this.up			= new Float32Array(4);
		this.right		= new Float32Array(4);
	}

	//--------------------------------------------------------------------------
	//Methods
	updateMatrix(){
		this.matView.reset()
			.vscale(this.scale)
			.rotateX(this.rotation.x * Transform.deg2Rad)
			.rotateY(this.rotation.y * Transform.deg2Rad)
			.rotateZ(this.rotation.z * Transform.deg2Rad)
			.vtranslate(this.position);

		//Calcuate the Normal Matrix which doesn't need translate, then transpose and inverses the mat4 to mat3
		Matrix4.normalMat3(this.matNormal,this.matView.raw);

		//Determine Direction after all the transformations.
		Matrix4.transformVec4(this.forward,[0,0,1,0],this.matView.raw);
		Matrix4.transformVec4(this.up,[0,1,0,0],this.matView.raw);
		Matrix4.transformVec4(this.right,[1,0,0,0],this.matView.raw);


		return this.matView.raw;
	}

	updateDirection(){
		Matrix4.transformVec4(this.forward,[0,0,1,0],this.matView.raw);
		Matrix4.transformVec4(this.up,[0,1,0,0],this.matView.raw);
		Matrix4.transformVec4(this.right,[1,0,0,0],this.matView.raw);
		return this;
	}

/*
	normalizeV4(a){
		var t = Math.sqrt( a[0]*a[0] + a[1]*a[1] + a[2]*a[2] );
		a[0] /= t;
		a[1] /= t;
		a[2] /= t;
	}
*/

	getViewMatrix(){ return this.matView.raw; }
	getNormalMatrix(){ return this.matNormal; }

	reset(){
		this.position.set(0,0,0);
		this.scale.set(1,1,1);
		this.rotation.set(0,0,0);
	}

	//--------------------------------------------------------------------------
	//Help Rotation
	//rotateX(angle){ this.rotation.x += angle * Math.PI / 180.0; return this; }
	//rotateY(angle){ this.rotation.y += angle * Math.PI / 180.0; return this; }
	//rotateZ(angle){ this.rotation.z += angle * Math.PI / 180.0; return this; }
}

Transform.deg2Rad = Math.PI/180; //Cache result, one less operation to do for each update.