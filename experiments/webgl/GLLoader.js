class GLLoader{
	constructor(gl){
		this.gl = gl;
		this.textures = [];
		this.meshes = [];		

		this.locPosition = 0;
		this.locNormal = 1;
		this.locUV = 2;
	}

	loadTexture(name,img){
		var id = this.gl.createTexture();

		this.gl.bindTexture(this.gl.TEXTURE_2D,id);
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
		
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR); //Setup up scaling
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST); //Setup down scaling
		this.gl.generateMipmap(this.gl.TEXTURE_2D);

		this.gl.bindTexture(this.gl.TEXTURE_2D,null);
		this.textures[name] = id;
		return id;		
	}

	createMeshVAO(name,aryInd,aryVert,aryNorm,aryUV){
		var rtn = {drawMode:this.gl.TRIANGLES};

		//Create and bind vao
		rtn.vao = this.gl.createVertexArray();
		this.gl.bindVertexArray(rtn.vao);

		//Set up vertices
		if(aryVert !== undefined && aryVert != null){
			rtn.bufVertices = this.gl.createBuffer();													//Create buffer...
			rtn.vertexLen = 3;																			//How many floats make up a vertex
			rtn.vertexCount = aryVert.length / rtn.vertexLen;											//How many vertices in the array

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, rtn.bufVertices);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(aryVert), this.gl.STATIC_DRAW);	//then push array into it.
			this.gl.enableVertexAttribArray(this.locPosition);											//Enable Attribute location
			this.gl.vertexAttribPointer(this.locPosition,3,this.gl.FLOAT,false,0,0);					//Put buffer at location of the vao
		}

		//Setup normals
		if(aryNorm !== undefined && aryNorm != null){
			rtn.bufNormals = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, rtn.bufNormals);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(aryNorm), this.gl.STATIC_DRAW);
			this.gl.enableVertexAttribArray(this.locNormal);
			this.gl.vertexAttribPointer(this.locNormal,3,this.gl.FLOAT,false, 0,0);
		}

		//Setup UV
		if(aryUV !== undefined && aryUV != null){
			rtn.bufUV = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, rtn.bufUV);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(aryUV), this.gl.STATIC_DRAW);
			this.gl.enableVertexAttribArray(this.locUV);
			this.gl.vertexAttribPointer(this.locUV,2,gl.FLOAT,false,0,0);	//UV only has two floats per component
		}

		//Setup Vertice Index.
		if(aryInd !== undefined && aryInd != null){
			rtn.bufIndex = this.gl.createBuffer();
			rtn.indexLength = aryInd.length;
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, rtn.bufIndex);
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryInd), this.gl.STATIC_DRAW);
		}

		//Clean up
		this.gl.bindVertexArray(null);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null);
		if(aryInd != null && aryInd !== undefined) this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null);

		this.meshes[name] = rtn;
		return rtn;
	}

	domObjToMesh(meshName,elmID){ return this.objToMesh(meshName,document.getElementById(elmID).innerHTML); }
	objToMesh(meshName,txt){
		//this.test(txt);
		txt = txt.trim() + "\n"; //add newline to be able to access last line in the for loop

		var line,				//Line text from obj file
			itm,				//Line split into an array
			ary,				//Itm split into an array, used for faced decoding
			i,
			ind,				//used to calculate index of the cache arrays
			isQuad = false,		//Determine if face is a quad or not
			aCache = [],		//Cache Dictionary key = itm array element, val = final index of the vertice
			cVert = [],			//Cache Vertice array read from obj
			cNorm = [],			//Cache Normal array ...
			cUV = [],			//Cache UV array ...
			fVert = [],			//Final Index Sorted Vertice Array
			fNorm = [],			//Final Index Sorted Normal Array
			fUV = [],			//Final Index Sorted UV array
			fIndex = [],		//Final Sorted index array
			fIndexCnt = 0,		//Final count of unique vertices
			posA = 0,
			posB = txt.indexOf("\n",0);
		
		while(posB > posA){
			line = txt.substring(posA,posB).trim();

			switch(line.charAt(0)){
				//......................................................
				//Cache Vertex Data for Index processing when going through face data
				case "v":
					itm = line.split(" "); itm.shift();

					switch(line.charAt(1)){
						case " ": //Vertex
							cVert.push(parseFloat(itm[0]));
							cVert.push(parseFloat(itm[1]));
							cVert.push(parseFloat(itm[2]));
							break;
						case "t": //Texture
							cUV.push(parseFloat(itm[0]));
							cUV.push(parseFloat(itm[1]));
							break;
						case "n": //Normal
							cNorm.push(parseFloat(itm[0]));
							cNorm.push(parseFloat(itm[1]));
							cNorm.push(parseFloat(itm[2]));
							break;
					}
					break;
				//......................................................
				//Process face data
				case "f":
					itm = line.split(" "); itm.shift();
					isQuad = false;


					for(i=0; i < itm.length; i++){
						//--------------------------------
						//In the event the face is a quad
						if(i == 3 && !isQuad){
							i = 2; //Last vertex in the first triangle is the start of the 2nd triangle in a quad.
							isQuad = true;
						}

						//--------------------------------
						//Has this vertex data been processed?
						if(itm[i] in aCache){
							fIndex.push( aCache[itm[i]] ); //it has, add its index to the list.
						}else{
							//New Unique vertex data, Process it.
							ary = itm[i].split("/");
							
							//Parse Vertex Data and save final version ordred correctly by index
							ind = (parseInt(ary[0])-1) * 3;
							
							fVert.push(cVert[ind]);
							fVert.push(cVert[ind+1]);
							fVert.push(cVert[ind+2]);

							//Parse Normal Data and save final version ordered correctly by index
							ind = (parseInt(ary[2])-1) * 3;
							fNorm.push(cNorm[ind]);
							fNorm.push(cNorm[ind+1]);
							fNorm.push(cNorm[ind+2]);

							//Parse Texture Data if available and save final version ordered correctly by index
							//if(ary[1] != ""){
								ind = (parseInt(ary[1])-1) * 2;
								//console.log(cUV[ind],cUV[ind+1],ind);
								fUV.push(cUV[ind]);
								fUV.push(1-cUV[ind+1]); //Need to flip the Y Position, WebGL UV coords are different from Blender.
							//}

							//Cache the vertex item value and its new index.
							//The idea is to create an index for each unique set of vertex data base on the face data
							//So when the same item is found, just add the index value without duplicating vertex,normal and texture.
							aCache[ itm[i] ] = fIndexCnt;
							fIndex.push(fIndexCnt);
							fIndexCnt++;
						}

						//--------------------------------
						//In a quad, the last vertex of the second triangle is the first vertex in the first triangle.
						if(i == 3 && isQuad) fIndex.push( aCache[itm[0]] );
					}
					break;
			}

			//Get Ready to parse the next line of the obj data.
			posA = posB+1;
			posB = txt.indexOf("\n",posA);
		}
		
		return this.createMeshVAO(meshName,fIndex,fVert,fNorm,fUV);
		//return {vert:fVert,norm:fNorm,uv:fUV,index:fIndex};		
	}
}