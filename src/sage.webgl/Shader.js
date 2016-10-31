//TODO, Research how to clean up the shader, delete the shaders and program from webgl
sage.webgl.Shader = class{
	constructor(cgl){
		this.gl = cgl.gl;		//Reference back to GL context
		this.program = null;	//Reference of the program created from the linked shaders
		this.locUniforms = [];	//Cache the location of uniforms
		this.locAttribs = [];	//Cache the location of the attribs
	}

	//Create shader program by pulling code from script tags on the page.
	createProgramByDom(vertID,fragID,doValidate){
		//Load up the shaders
		var shaderVert = this.getDomShader(vertID);
		if(shaderVert == null) return false;

		var shaderFrag = this.getDomShader(fragID);
		if(shaderFrag == null) return false;

		//Link shaders together
		var prog = this.gl.createProgram();
		this.gl.attachShader(prog,shaderVert);
		this.gl.attachShader(prog,shaderFrag);
		this.gl.linkProgram(prog);

		if(!this.gl.getProgramParameter(prog, this.gl.LINK_STATUS)){
			console.error("Error creating shader program.",this.gl.getProgramInfoLog(prog));
			return false;
		}

		//Only do this for additional debugging.
		if(doValidate){
			this.gl.validateProgram(prog);
			if(!this.gl.getProgramParameter(prog,this.gl.VALIDATE_STATUS)){
				console.error("Error validating program", this.gl.getProgramInfoLog(prog));
				return false;
			}
		}

		//Activate shader program, then get enable its attributes
		this.gl.useProgram(prog);
		this.program = prog;

		return true;
	}

	//Pull the shader code from a script tag
	getDomShader(elmID){
		var elm = document.getElementById(elmID);
		if(!elm){ console.log(elmID + " shader not found."); return null; }
		
		//Determine Shader Type from Element
		var type;
		switch(elm.type){
			case "x-shader/x-vertex":	type = this.gl.VERTEX_SHADER;	break;
			case "x-shader/x-fragment":	type = this.gl.FRAGMENT_SHADER;	break;
			default:
				console.error("Unknown shader type in " + elmID);
				return null; 
		}
		
		//Compile Shader
		var shader = this.gl.createShader(type);
		this.gl.shaderSource(shader,elm.text);
		this.gl.compileShader(shader);

		//Get Error data if shader failed compiling
		if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
			console.error("Error compiling shader : " + elmID,this.gl.getShaderInfoLog(shader));
			this.gl.deleteShader(shader);
			return null;
		}

		return shader;
	}


	//--------------------------------------------------------------------------
	//Getters and Setters
	getUniformLoc(name){
		if(this.locUniforms[name] !== undefined) return this.locUniforms[name];

		var loc = this.gl.getUniformLocation(this.program,name);  //like an param array, get the index of the shader property
		if(loc < 0){
			console.error("Unable to find uniform",name);
			return -1;
		}

		this.locUniforms[name] = loc;
		return loc;	
	}

	getAttribLoc(name){
		if(this.locAttribs[name] !== undefined) return this.locAttribs[name];


		var loc = this.gl.getAttribLocation(this.program,name);  //like an param array, get the index of the shader property
		if(loc < 0){
			console.error("Unable to find attribute",name);
			return -1;
		}

		this.locAttribs[name] = loc;
		return loc;	
	}


	//--------------------------------------------------------------------------
	//Attribute Handlers
	attribFloat(){
		if(arguments.length < 2){
			console.error("Need to send at least 2 parameters to attribFloat");
			return false;
		}
		
		var name = arguments[0],
			loc = this.getAttribLoc(name);

		if(loc < 0) return false;

		switch(arguments.length){
			case 2: this.gl.vertexAttrib1f(loc, arguments[1]); return true;
			case 3: this.gl.vertexAttrib2f(loc, arguments[1], arguments[2]); return true;
			case 4: this.gl.vertexAttrib3f(loc, arguments[1], arguments[2], arguments[3]); return true;
			case 5: this.gl.vertexAttrib4f(loc, arguments[1], arguments[2], arguments[3], arguments[4]); return true;
		}

		console.error("attribFloat did not handle the argument count");
		return false;
	}

	attribFAryBuf(name,dataLen,buffer){
		if(this.program == null) return false;

		var isNew = (this.locAttribs[name] === undefined),
			loc = this.getAttribLoc(name);

		if(loc < 0) return;
		if(isNew) this.gl.enableVertexAttribArray(loc); //Make it usable.

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER,buffer);
		this.gl.vertexAttribPointer(loc,dataLen,this.gl.FLOAT,false,Float32Array.BYTES_PER_ELEMENT * dataLen,0);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null);
	}


	//--------------------------------------------------------------------------
	//Uniform Handlers
	uniformFloat(){
		if(arguments.length < 2){
			console.error("Need to send at least 2 parameters to uniformFloat");
			return false;
		}
		
		var name = arguments[0],
			loc = this.getUniformLoc(name);
		
		if(loc < 0) return false;

		switch(arguments.length){
			case 2: this.gl.uniform1f(this.uniforms[name],arguments[1]); return true;
			case 3: this.gl.uniform2f(this.uniforms[name],arguments[1],arguments[2]); return true;
			case 4: this.gl.uniform3f(this.uniforms[name],arguments[1],arguments[2],arguments[3]); return true;
			case 5: this.gl.uniform4f(this.uniforms[name],arguments[1],arguments[2],arguments[3],arguments[4]); return true;
		}

		console.error("uniformFloat did not handle the argument count");
		return false;
	}

	uniformMatrix4fv(name,fData){
		var loc = this.getUniformLoc(name);
		if(loc < 0) return false;

		this.gl.uniformMatrix4fv(loc, false, fData);
		return true;
	}
}