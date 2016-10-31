
sage.webgl.Transform = class{
	constructor(){
		//transform vectors
		this.position	= new sage.webgl.Vector3(0,0,0);
		this.scale		= new sage.webgl.Vector3(1,1,1);
		this.rotation	= new sage.webgl.Vector3(0,0,0);  //TODO, This needs to be bound to -360 to 360
		this.matrix 	= new sage.webgl.Matrix4();
	}

	//--------------------------------------------------------------------------
	//Methods
	updateMatrix(){
		var ang = Math.PI/180;

		this.matrix.reset()
			.vscale(this.scale)
			.rotateX(this.rotation.x * ang)
			.rotateY(this.rotation.y * ang)
			.rotateZ(this.rotation.z * ang)
			.vtranslate(this.position);

		return this.matrix.raw;
	}

	reset(){
		this.position.set(0,0,0);
		this.scale.set(1,1,1);
		this.rotation.set(0,0,0);
	}
}