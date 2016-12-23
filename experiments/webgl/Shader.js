class ShaderTester{
	constructor(gl){
		this.gl = gl;			//Reference back to GL context
		this.program = null;	//Reference of the program created from the linked shaders
		this.locUniforms = [];	//Cache the location of uniforms
		this.locAttribs = [];	//Cache the location of the attribs

		//this.vertexShader = null;
		//this.fragmentShader = null;
	}


	//Create shader program by pulling code from script tags on the page.
	createFromDom(vertID,fragID,doValidate){
		this.program = ShaderUtil.createProgramFromDom(this.gl,vertID,fragID,doValidate);
		return (this.program != null);

		/*

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
			this.gl.deleteProgram(prog);
			return false;
		}

		//Only do this for additional debugging.
		if(doValidate){
			this.gl.validateProgram(prog);
			if(!this.gl.getProgramParameter(prog,this.gl.VALIDATE_STATUS)){
				console.error("Error validating program", this.gl.getProgramInfoLog(prog));
				this.gl.deleteProgram(prog);
				return false;
			}
		}
		
		//Can delete the shaders since the program has been made.
		this.gl.detachShader(prog,shaderVert); //TODO, detaching might cause issues on some browsers, Might only need to delete.
		this.gl.detachShader(prog,shaderFrag);
		this.gl.deleteShader(shaderFrag);
		this.gl.deleteShader(shaderVert);

		//Activate shader program, then get enable its attributes
		//this.gl.useProgram(prog);
		this.program = prog;
		//this.vertexShader = shaderVert;
		//this.fragmentShader = fragmentShader;

		return true;
		*/
	}

	//Pull the shader code from a script tag
	/*
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
	*/

	activate(){ this.gl.useProgram(this.program); }
	deactivate(){ this.gl.useProgram(null); }

	dispose(){
		//unbind the program if its currently active
		if(this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) this.gl.useProgram(null);
		this.gl.deleteProgram(this.program);
	}

	//--------------------------------------------------------------------------
	//Getters and Setters
	getUniformLoc(name){
		if(this.locUniforms[name] !== undefined) return this.locUniforms[name];

		var loc = this.gl.getUniformLocation(this.program,name);  //like an param array, get the index of the shader property
		if(loc < 0){ console.error("Unable to find uniform",name); return -1; }

		this.locUniforms[name] = loc;
		return loc;	
	}

	getAttribLoc(name){
		if(this.locAttribs[name] !== undefined) return this.locAttribs[name];

		var loc = this.gl.getAttribLocation(this.program,name);  //like an param array, get the index of the shader property
		if(loc < 0){ console.error("Unable to find attribute",name); return -1; }

		this.locAttribs[name] = loc;
		return loc;	
	}

	//--------------------------------------------------------------------------
	//Uniform Handlers
	uniformFloat(){
		if(arguments.length < 2){ console.error("Need to send at least 2 parameters to uniformFloat"); return false; }
		
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


	//--------------------------------------------------------------------------
	//Attribute Handlers
	attribFloat(){
		if(arguments.length < 2){ console.error("Need to send at least 2 parameters to attribFloat"); return false; }
		
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

		var loc = this.getAttribLoc(name); //isNew = (this.locAttribs[name] === undefined),

		if(loc < 0) return;
		this.gl.enableVertexAttribArray(loc); //Make it usable. //if(isNew) 

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER,buffer);
		//this.gl.vertexAttribPointer(loc,dataLen,this.gl.FLOAT,false,Float32Array.BYTES_PER_ELEMENT * dataLen,0);
		this.gl.vertexAttribPointer(loc,dataLen,this.gl.FLOAT,false,0,0);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null);
	}
}



class Shader{
	constructor(gl,vertShaderSrc,fragShaderSrc,projectionMatrix){
		this.program = ShaderUtil.createProgramFromSrc(gl,vertShaderSrc,fragShaderSrc,true);

		if(this.program != null){
			this.gl = gl;
			this.attribLoc = ShaderUtil.getStandardAttribLocations(gl,this.program);
			this.uniformLoc = ShaderUtil.getStandardUniformLocations(gl,this.program);

			gl.useProgram(this.program);
			gl.uniformMatrix4fv(this.uniformLoc.projection, false, projectionMatrix);
		}
	}

	activate(){ this.gl.useProgram(this.program); }
	deactivate(){ this.gl.useProgram(null); }

	setPerspective(matData){ this.gl.uniformMatrix4fv(this.uniformLoc.perspective, false, matData); }
	setModalMatrix(matData){ this.gl.uniformMatrix4fv(this.uniformLoc.modalMatrix, false, matData); }
	setCameraMatrix(matData){ this.gl.uniformMatrix4fv(this.uniformLoc.cameraMatrix, false, matData); }

	dispose(){
		//unbind the program if its currently active
		if(this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) this.gl.useProgram(null);
		this.gl.deleteProgram(this.program);
	}
}


class ShaderUtil{
	//.............................................
	//fundemental shader and program buidling
	static createShader(gl,src,type){
		var shader = gl.createShader(type);
		gl.shaderSource(shader,src);
		gl.compileShader(shader);

		//Get Error data if shader failed compiling
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			console.error("Error compiling shader : " + src, gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	static createProgram(gl,vShader,fShader,doValidate){
		//Link shaders together
		var prog = gl.createProgram();
		gl.attachShader(prog,vShader);
		gl.attachShader(prog,fShader);
		gl.linkProgram(prog);

		//Check if successful
		if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){
			console.error("Error creating shader program.",gl.getProgramInfoLog(prog));
			gl.deleteProgram(prog);
			return null;
		}

		//Only do this for additional debugging.
		if(doValidate){
			gl.validateProgram(prog);
			if(!gl.getProgramParameter(prog,gl.VALIDATE_STATUS)){
				console.error("Error validating program", gl.getProgramInfoLog(prog));
				gl.deleteProgram(prog);
				return null;
			}
		}
		
		//Can delete the shaders since the program has been made.
		gl.detachShader(prog,vShader); //TODO, detaching might cause issues on some browsers, Might only need to delete.
		gl.detachShader(prog,fShader);
		gl.deleteShader(fShader);
		gl.deleteShader(vShader);

		return prog;
	}

	//.............................................
	//Premade methods to put together a shader program instead of doing it call by call.
	static createProgramFromDom(gl,vertElmID,fragElmID,doValidate){
		//Get Shader source from dom and validate
		var vertSrc = ShaderUtil.domShaderSrc(vertElmID); if(vertSrc == null) return null;
		var fragSrc = ShaderUtil.domShaderSrc(fragElmID); if(fragSrc == null) return null;

		return ShaderUtil.createProgramFromSrc(gl,vertSrc,fragSrc,doValidate);
	}

	static createProgramFromSrc(gl,vertSrc,fragSrc,doValidate){
		//Compile shader code through gl and validate
		var vShader = ShaderUtil.createShader(gl,vertSrc,gl.VERTEX_SHADER); if(vShader == null) return null;
		var fShader = ShaderUtil.createShader(gl,fragSrc,gl.FRAGMENT_SHADER);
		
		if(fShader == null){ gl.deleteShader(vShader); return null; }

		//Create program from shaders
		return ShaderUtil.createProgram(gl,vShader,fShader,doValidate);
	}

	static createStandardVOA(gl,aryVert,locPosition,aryInd,aryNorm,normLocation){
		var rtn = {};

		//Create and bind vao
		rtn.vao = gl.createVertexArray();
		gl.bindVertexArray(rtn.vao);

		//Set up vertices
		if(aryVert != null && locPosition >= 0){
			rtn.bufVertices = gl.createBuffer();										//Create buffer...
			gl.bindBuffer(gl.ARRAY_BUFFER, rtn.bufVertices);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aryVert), gl.STATIC_DRAW);	//then push array into it.
			gl.enableVertexAttribArray(locPosition);									//Enable Attribute location
			gl.vertexAttribPointer(locPosition,3,gl.FLOAT,false, 0,0);					//Put buffer at location of the vao
		}

		if(aryNorm != null && normLocation >= 0){
			rtn.bufNormals = gl.createBuffer();										//Create buffer...
			gl.bindBuffer(gl.ARRAY_BUFFER, rtn.bufNormals);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aryNorm), gl.STATIC_DRAW);	//then push array into it.
			gl.enableVertexAttribArray(normLocation);									//Enable Attribute location
			gl.vertexAttribPointer(normLocation,3,gl.FLOAT,false, 0,0);					//Put buffer at location of the vao
		}

		if(aryInd != null && aryInd !== undefined){
			rtn.bufIndex = gl.createBuffer();
			rtn.indexLength = aryInd.length;

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rtn.bufIndex);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryInd), gl.STATIC_DRAW);
		}

		//Clean up
		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER,null);
		if(aryInd != null && aryInd !== undefined) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);

		return rtn;
	}

	//static deleteStandardVOA(gl)

	//.............................................
	//getter, setters
	static getVariableLoc(gl,name,prog,type){
		var loc = -1;

		switch(type){
			case "uniform": loc = gl.getUniformLocation(prog,name); break;
			case "attrib": 	loc = gl.getAttribLocation(prog,name); break; 
		}

		if(loc < 0) console.error("Unable to find " + type,name);
		return loc;	
	}


	/*
		All of them are buffers
		a_position v3 	1
		a_index int 	2
		a_norm v3 		4
		a_uv v2 		8
	*/
	static getStandardAttribLocations(gl,program){
		return {
			position:	gl.getAttribLocation(program,"a_position"),
			index:		gl.getAttribLocation(program,"a_index"),
			uv:			gl.getAttribLocation(program,"a_uv"),
			norm:		gl.getAttribLocation(program,"a_normal")
		};
	}

	static getStandardUniformLocations(gl,program){
		return {
			projection:		gl.getUniformLocation(program,"uPMatrix"),
			modalMatrix:	gl.getUniformLocation(program,"uMVMatrix"),
			cameraMatrix:	gl.getUniformLocation(program,"uCameraMatrix")
		};
	}

	// must have at least 3 params (gl,loc,f1,f2,f3,f4)
	static setUniformFloat(){
		if(arguments.length < 3){ console.error("Need to send at least 2 parameters use setUniformFloat"); return false; }
		if(arguments[1] < 0) return false;

		switch(arguments.length){
			case 3: arguments[0].uniform1f(arguments[1],arguments[2]); return true;
			case 4: arguments[0].uniform2f(arguments[1],arguments[2],arguments[3]); return true;
			case 5: arguments[0].uniform3f(arguments[1],arguments[2],arguments[3],arguments[4]); return true;
			case 6: arguments[0].uniform4f(arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]); return true;
		}

		console.error("setUniformFloat did not handle the argument count");
		return false;
	}

	// must have at least 3 params (gl,loc,f1,f2,f3,f4)
	static setAttribFloat(){
		if(arguments.length < 3){ console.error("Need to send at least 2 parameters to use setAttribFloat"); return false; }
		if(arguments[1] < 0) return false;

		switch(arguments.length){
			case 2: arguments[0].vertexAttrib1f(arguments[1], arguments[2]); return true;
			case 3: arguments[0].vertexAttrib2f(arguments[1], arguments[2], arguments[3]); return true;
			case 4: arguments[0].vertexAttrib3f(arguments[1], arguments[2], arguments[3], arguments[4]); return true;
			case 5: arguments[0].vertexAttrib4f(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]); return true;
		}

		console.error("setAttribFloat did not handle the argument count");
		return false;
	}

	static setAttribFloatAryBuf(gl,prog,loc,dataLen,buffer){
		gl.enableVertexAttribArray(loc);						//Enable attribute so it can be used 
		gl.bindBuffer(gl.ARRAY_BUFFER,buffer);					//bind the buffer thats being worked with.
		gl.vertexAttribPointer(loc,dataLen,gl.FLOAT,false,0,0);	//Set the buffer to Shader Attribute
		gl.bindBuffer(gl.ARRAY_BUFFER,null);					//unbind buffer
		//gl.vertexAttribPointer(loc,dataLen,this.gl.FLOAT,false,Float32Array.BYTES_PER_ELEMENT * dataLen,0);
	}


	//static setUniformMatrix4fv(gl,loc,fData){ gl.uniformMatrix4fv(loc, false, fData); } //Kinda useless, better off calling from gl directly.

	//.............................................
	//Helper Methods
	static domShaderSrc(elmID){
		var elm = document.getElementById(elmID);
		if(!elm || elm.text == ""){ console.log(elmID + " shader not found or no text."); return null; }
		
		return elm.text;

		//Determine Shader Type from Element
		//var type;
		//switch(elm.type){
		//	case "x-shader/x-vertex":	type = "VERTEX_SHADER";		break;
		//	case "x-shader/x-fragment":	type = "FRAGMENT_SHADER";	break;
		//	default:
		//		console.error("Unknown shader type in " + elmID);
		//		return null; 
		//}
		//return {type:type,src:elm.text};
	}
}