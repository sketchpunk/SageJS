/*
Notes:

At some point need to seperate modal data and its bufffers as a single class that gets reference by a different object.
So the idea is to have a single set of mesh data buffers that can be referenced by many transform objects. For instance,
when creating trees, its better to have a single buffer on the gpu then use different transforms to render the mesh
at different position, scale or rotation. Think the mesh object should also have the option to have different shaders
applied to it, even thought I can't think of a reason why but nice to have the option to switch shaders incase of some
mechanic needs to be achieved.
*/

class Modal{
	constructor(gl,shader,vertAry,indAry,normAry){
		this.transform = new Transform();					//Object handles all the data for the Modal View Matrix data needed for the shader
		this.gl = gl;										//Just a reference back to the GL context
		this.shader = shader;								//Reference back to the shader, so during render it can push its transform value into it.
		
		this.vertexLen = 3;									//How many floats make up a vertex
		this.vertexCount = vertAry.length / this.vertexLen;	//How many vertices exist in the mesh

		this.drawMode = gl.TRIANGLES;						//Make the draw mode dynamic, some modals might need to render in different modes

		//Creating all the buffers and setup the VAO to make rendering width a shader quick and easy.
		this.renderData = ShaderUtil.createStandardVOA(gl,vertAry,shader.attribLoc.position,indAry,normAry,shader.attribLoc.norm);
	}

	render(){
		this.shader.setModalMatrix(this.transform.updateMatrix());	//Set the transform, so the shader knows where the modal exists in 3d space

		this.gl.bindVertexArray(this.renderData.vao);				//Enable VAO, this will set all the predefined attributes for the shader
		//this.gl.enableVertexAttribArray(0);
		//this.gl.enableVertexAttribArray(1);

		if(this.renderData.indexLength){
			//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.renderData.bufIndex);
			this.gl.drawElements(this.drawMode, this.renderData.indexLength, gl.UNSIGNED_SHORT, 0);
			//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
		}else this.gl.drawArrays(this.drawMode, 0, this.vertexCount);		//The Actual rendering

		this.gl.bindVertexArray(null);								//Unbind the voa.
	}

	//TODO create method to delete voa and buffers.
}