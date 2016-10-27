/*
precision mediump float; //In shader, what kind level of precision float to use. need to set when passing data to fragmet shader
attribute vec4 coords;
attribute float pointSize;

uniform vec4 color;

coords = gl.getAttributeLocation(shaderProgram,"coords");
gl.vertexAttrib3f(coords,0.5,0.0,0.0,1.0);
gl.vertexAttrib1f(pointSize,100);

color = gl.getUniformLocation(shaderProgram,"color");
gl.uniform4f(color,0,1,0,1);
*/


sage.webgl.Shader = class{
	constructor(cgl){
		this.mGL = cgl.mGL;
		this.program = null;
		this.vertexPositionAttrib = null;
		this.uniforms = [];
		this.attribs = [];
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

	getUniformLoc(name){
		var loc = this.mGL.getUniformLocation(this.program,name);  //like an param array, get the index of the shader property
		if(loc < 0){
			console.error("Unable to find uniform",name);
			return false;
		}

		this.uniforms[name] = loc;
		return true;	
	}

	getAttribLoc(name){
		var loc = this.mGL.getAttribLocation(this.program,name);  //like an param array, get the index of the shader property
		if(loc < 0){
			console.error("Unable to find attribute",name);
			return false;
		}

		this.attribs[name] = loc;
		return true;	
	}

	//Todo, Maybe merge update and add into a single function call.
	updateAttribFloat(){
		if(arguments.length < 2){
			console.error("Need to send at least 2 parameters to updateAttribFloat");
			return false;
		}
		
		var name = arguments[0];
		switch(arguments.length){
			//Just a single float
			case 2: this.mGL.vertexAttrib1f(this.attribs[name],arguments[1]); return true;
			//Passing Two Floats
			case 3: this.mGL.vertexAttrib2f(this.attribs[name],arguments[1],arguments[2]); return true;
			//Passing 3
			case 4: this.mGL.vertexAttrib3f(this.attribs[name],arguments[1],arguments[2],arguments[3]); return true;
		}

		console.error("updateAttribFloat did not handle the argument count");
		return false;
	}

	addAttribFloat(){
		if(arguments.length < 2){
			console.error("Need to send at least 2 parameters to addAttribFloat");
			return false;
		}
		
		var name = arguments[0];
		if(!this.getAttribLoc(name)) return false;

		switch(arguments.length){
			//Just a single float
			case 2: this.mGL.vertexAttrib1f(this.attribs[name],arguments[1]); return true;
			//Passing Two Floats
			case 3: this.mGL.vertexAttrib2f(this.attribs[name],arguments[1],arguments[2]); return true;
			//Passing 3
			case 4: this.mGL.vertexAttrib3f(this.attribs[name],arguments[1],arguments[2],arguments[3]); return true;
		}

		console.error("AddAttribFloat did not handle the argument count");
		return false;
	}

	addUniformFloat(){
		if(arguments.length < 2){
			console.error("Need to send at least 2 parameters to addUniformFloat");
			return false;
		}
		
		var name = arguments[0];
		if(!this.getUniformLoc(name)) return false;

		switch(arguments.length){
			//Just a single float
			case 2: this.mGL.uniform1f(this.uniforms[name],arguments[1]); return true;
			//Passing 2
			case 3: this.mGL.uniform2f(this.uniforms[name],arguments[1],arguments[2]); return true;
			//Passing 3
			case 4: this.mGL.uniform3f(this.uniforms[name],arguments[1],arguments[2],arguments[3]); return true;
			//Passing 4
			case 5: this.mGL.uniform4f(this.uniforms[name],arguments[1],arguments[2],arguments[3],arguments[4]); return true;
		}

		console.error("addUniformFloat did not handle the argument count");
		return false;
	}


	addAttribAryBuffer(attrName,dataLen,buffer){
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
			this.mGL.bindBuffer(cgl.mGL.ARRAY_BUFFER,null);
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

	updateUniformMatrix4fv(uName,fData){
		this.mGL.uniformMatrix4fv(this.uniforms[uName], false, fData);
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