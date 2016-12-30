class Shader{
	constructor(gl,vertShaderSrc,fragShaderSrc,projectionMatrix){
		this.program = ShaderUtil.createProgramFromSrc(gl,vertShaderSrc,fragShaderSrc,true);

		if(this.program != null){
			this.gl = gl;
			gl.useProgram(this.program);

			this.attribLoc = ShaderUtil.getStandardAttribLocations(gl,this.program);
			this.uniformLoc = ShaderUtil.getStandardUniformLocations(gl,this.program);

			gl.uniformMatrix4fv(this.uniformLoc.projection, false, projectionMatrix);
		}
	}

	activate(){ this.gl.useProgram(this.program); }
	deactivate(){ this.gl.useProgram(null); }

	setPerspective(matData){ this.gl.uniformMatrix4fv(this.uniformLoc.perspective, false, matData); }
	setModalMatrix(matData){ this.gl.uniformMatrix4fv(this.uniformLoc.modalMatrix, false, matData); }
	setCameraMatrix(matData){ this.gl.uniformMatrix4fv(this.uniformLoc.cameraMatrix, false, matData); }

	preRender(){} //abstract method

	renderModal(modal){
		this.setModalMatrix(modal.getViewMatrix());		//Set the transform, so the shader knows where the modal exists in 3d space
		this.gl.bindVertexArray(modal.meshData.vao);	//Enable VAO, this will set all the predefined attributes for the shader

		if(modal.meshData.indexLength) this.gl.drawElements(modal.meshData.drawMode, modal.meshData.indexLength, gl.UNSIGNED_SHORT, 0);
		else this.gl.drawArrays(modal.meshData.drawMode, 0, modal.meshData.vertexCount);

		this.gl.bindVertexArray(null);	
	}

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
/*
	static createStandardVOA(gl,aryInd,aryVert,locPosition,aryNorm,normLocation,aryUV,uvLocation){
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

		if(aryUV != null && uvLocation >=0){
			rtn.bufUV = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, rtn.bufUV);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aryUV), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(uvLocation);
			gl.vertexAttribPointer(uvLocation,2,gl.FLOAT,false,0,0);
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
*/
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

	static getStandardAttribLocations(gl,program){
		return {
			position:	gl.getAttribLocation(program,"a_position"),
			norm:		gl.getAttribLocation(program,"a_normal"),
			uv:			gl.getAttribLocation(program,"a_uv")
		};
	}

	static getStandardUniformLocations(gl,program){
		return {
			projection:		gl.getUniformLocation(program,"uPMatrix"),
			modalMatrix:	gl.getUniformLocation(program,"uMVMatrix"),
			cameraMatrix:	gl.getUniformLocation(program,"uCameraMatrix"),
			mainTexture:	gl.getUniformLocation(program,"uMainTex")
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