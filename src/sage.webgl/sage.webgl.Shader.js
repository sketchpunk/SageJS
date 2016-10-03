sage.webgl.Shader = class{
	constructor(cgl){
		this.mGL = cgl.mGL;
		this.program = null;
		this.vertexPositionAttrib = null;
		this.uniforms = [];
	}

	createProgram(vertID,fragID,doValidate){		
		//Load up the shaders
		var shaderVert = this.getDomShader(vertID);
		if(shaderVert == null) return false;

		var shaderFrag = this.getDomShader(fragID);
		if(shaderFrag == null) return false;

		//Link shaders together
		var prog = this.mGL.createProgram();
		this.mGL.attachShader(prog,shaderVert);
		this.mGL.attachShader(prog,shaderFrag);
		this.mGL.linkProgram(prog);

		if(!this.mGL.getProgramParameter(prog, this.mGL.LINK_STATUS)){
			console.error("Error creating shader program.",this.mGL.getProgramInfoLog(prog));
			return false;
		}

		//Only do this for additional debugging.
		if(doValidate){
			this.mGL.validateProgram(prog);
			if(!this.mGL.getProgramParameter(prog,this.mGL.VALIDATE_STATUS)){
				console.error("Error validating program", this.mGL.getProgramInfoLog(prog));
				return;
			}
		}

		//Activate shader program, then get enable its attributes
		this.mGL.useProgram(prog);
		//this.vertexPositionAttrib = this.mGL.getAttribLocation(prog,"aVertexPosition"); //like an param array, get the index of the shader property
		//this.mGL.enableVertexAttribArray(this.vertexPositionAttrib); //Make it usable.
		this.program = prog;

		return true;
	}

	addAttrib(attrName,dataLen,buffer){
		if(this.program == null) return false;

		var loc = this.mGL.getAttribLocation(this.program,attrName);  //like an param array, get the index of the shader property
		if(loc < 0){
			console.error("Unable to find attribute",attrName);
			return false;
		}

		this.mGL.enableVertexAttribArray(loc); //Make it usable.

		if(buffer){
			this.mGL.bindBuffer(cgl.mGL.ARRAY_BUFFER,buffer);
			this.mGL.vertexAttribPointer(loc,dataLen,this.mGL.FLOAT,false,Float32Array.BYTES_PER_ELEMENT * dataLen,0);
		}

		return true;
	}

	getDomShader(elmID){
		var elm = document.getElementById(elmID);
		if(!elm){ console.log(elmID + " shader not found."); return null; }
		
		//Determine Shader Type from Element
		var type;
		if(elm.type == "x-shader/x-vertex") type = this.mGL.VERTEX_SHADER;
		else if(elm.type == "x-shader/x-fragment") type = this.mGL.FRAGMENT_SHADER
		else{ console.error("Unknown shader type in " + elmID); return null; }
		
		//Compile Shader
		var shader = this.mGL.createShader(type);
		this.mGL.shaderSource(shader,elm.text);
		this.mGL.compileShader(shader);

		//Get Error data if shader failed compiling
		if(!this.mGL.getShaderParameter(shader, this.mGL.COMPILE_STATUS)){
			console.error("Error compiling shader : " + elmID,this.mGL.getShaderInfoLog(shader));
			this.mGL.deleteShader(shader);
			return null;
		}

		return shader;
	}

	updateUniformMatrix4fv(uName,fData){ this.mGL.uniformMatrix4fv(this.uniforms[uName],false,fData); }
	addUniformMatrix4fv(uName,fData){
		var uni = this.mGL.getUniformLocation(this.program,uName);
		if(uni < 0){ console.error("Uniform for shader not found",uName); return false; }

		this.mGL.uniformMatrix4fv(uni, false, fData);

		this.uniforms[uName] = uni; //cache the location for this constant in the shader program
		return true;
	}


	prepareRender(pMatrix,mvMatrix,mesh){
		//Define the attributes to the gpu
		/*
		this.mGL.vertexAttribPointer(this.vertexPositionAttrib	//param index,
			,3													//data length, so vert3 is 3 elements long.
			,this.mGL.FLOAT										//Type of data
			,false												//Is data normalized
			,3 * Float32Array.BYTES_PER_ELEMENT					//Size of individual vertex
			,0													//Offset from the single vertext
		);
		*/
		//this.mGL.useProgram(shader.program);

		//define attributes
		/*
		var attr;
		for(var itm in this.aryAttribs){
			attr = this.aryAttribs[itm];

			this.mGL.bindBuffer(cgl.mGL.ARRAY_BUFFER, mesh.buffer); //Bind vertice buffer for procssing
			this.mGL.vertexAttribPointer(attr.location  
				,attr.dataLength
				,this.mGL.FLOAT
				,false
				,Float32Array.BYTES_PER_ELEMENT * attr.dataLength
				,0
			);
		}
		*/
	
		//Setup the constants that shader needs to run
		//TODO, this should be added in like attributes.
		//var pUniform = this.mGL.getUniformLocation(this.program, "uPMatrix");
		//this.mGL.uniformMatrix4fv(pUniform, false, new Float32Array(pMatrix.flatten()));

		//var mvUniform = this.mGL.getUniformLocation(this.program, "uMVMatrix");
		//this.mGL.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
	}
}