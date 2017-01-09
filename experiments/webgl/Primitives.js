class Quad{
	static createMesh(gLoader){
		var aVert = [ -0.5,0.5,0, -0.5,-0.5,0, 0.5,-0.5,0, 0.5,0.5,0 ],
		aIndex = [ 0,1,2, 2,3,0 ];
		
		var mesh = gLoader.createMeshVAO("Quad",aIndex,aVert);
		mesh.drawMode = gLoader.gl.TRIANGLES;

		return mesh;
	}

	static createModal(gLoader){
		var mesh = Quad.createMesh(gLoader);
		return new Modal(mesh);
	}
}

class Axis{
	static createMesh(gLoader){
		var aVert = [ -5,0,0, 5,0,0, 0,-5,0, 0,5,0, 0,0,-5, 0,0,5 ],
			aIndex = [ 0,1, 2,3, 4,5 ],
			aColor = [ 1,0,0, 1,0,0, 0,0,1, 0,0,1, 0,1,0, 0,1,0 ];

		var mesh = gLoader.createMeshVAO("Axis",aIndex,aVert);
		mesh.drawMode = gLoader.gl.LINES;

		gLoader.gl.bindVertexArray(mesh.vao);

		mesh.bufColor = gLoader.gl.createBuffer();
		gLoader.gl.bindBuffer(gLoader.gl.ARRAY_BUFFER, mesh.bufColor);
		gLoader.gl.bufferData(gLoader.gl.ARRAY_BUFFER, new Float32Array(aColor), gLoader.gl.STATIC_DRAW);
		gLoader.gl.enableVertexAttribArray(1);
		gLoader.gl.vertexAttribPointer(1,3,gLoader.gl.FLOAT,false,0,0);

		gLoader.gl.bindVertexArray(null);
		gLoader.gl.bindBuffer(gLoader.gl.ARRAY_BUFFER,null);

		return mesh;
	}
}

class Grid{
	static createMesh(gLoader){
		var size = 10,			// W/H of the outer box of the grid
			div = 10.0,			// How to divide up the box
			step = size / div,	// Steps between each line
			half = size / 2;	// From origin the starting position is half the size.

		//To save 4 vertices, define the outer box and connect the dots since the points can be used twice
		var aVert = [ -half,0,half, -half,0,-half, half,0,half, half,0,-half ],
			aIndex = [ 0,1, 2,3, 0,2, 1,3 ]; //Left,Right,Top,Bottom

		//Create the inner lines to create the grid
		var ind = 4,p = 0;
		for(var i=1; i < div; i++){
			//Vertical line
			p = -half + (i * step);
			aVert.push(p);		//x1
			aVert.push(0);		//y1
			aVert.push(half);	//z1

			aVert.push(p);		//x2
			aVert.push(0);		//y2
			aVert.push(-half);	//z2

			//Horizontal line
			p = half - (i * step);
			aVert.push(-half);	//x1
			aVert.push(0);		//y1
			aVert.push(p);		//z1

			aVert.push(half);	//x2
			aVert.push(0);		//y2
			aVert.push(p);		//z2

			//Line Indexes.
			aIndex.push(ind);
			aIndex.push(ind+1);
			aIndex.push(ind+2);
			aIndex.push(ind+3);
			ind+=4;
		}

		var mesh = gLoader.createMeshVAO("Grid",aIndex,aVert);
		mesh.drawMode = gLoader.gl.LINES;

		return mesh;
	}
}


class Cube{
	static createMesh(gLoader,width,height,depth){
		//determine the size of the cube in 3d Space with the origin at its center.
		var w = width*0.5, h = height*0.5, d = depth*0.5,
			trig = [];		//Holds the triangle indexes, each square face is 6 floats

		//..............................
		//Create the front face based on the size, then generate the back by changing Z
		var v = [	-w, -h, d,
					 w, -h, d,
					 w,  h, d,
					-w,  h, d ];

		var vertLen = v.length;

		for(var i=0; i < vertLen; i++) v.push((i%3 != 2)? v[i] : -v[i] );

		//..............................
		//Using the 8 points that create the front and back face, create the remaining 4 faces
		//by going around the cube to generate the vertices of the remaining faces (bottom,right,top,left)
		var inc = 0,
			ind = 0,
			sqr = [0,0,0,0];
		
		for(var x=0; x < 4; x++){
			inc = (x+1)%4;
			sqr[0] = x+4;
			sqr[1] = inc+4;
			sqr[2] = inc;
			sqr[3] = x;

			for(var i=0; i < sqr.length; i++){
				ind = sqr[i]*3;
				v.push(v[ ind ]);
				v.push(v[ ind+1 ]);
				v.push(v[ ind+2 ]);
			}
		}

		//..............................
		//Create all the triangles for the cube [0,1,2] [2,3,0]
		var vectorCnt = v.length/ 3;
		for(var i=0; i < vectorCnt; i+=2){
			trig.push(i);
			trig.push(i+1);
			trig.push( (Math.floor(i/4)*4)+((i+2)%4) );
		}


		var aryNorm = [
		  // Front
		   0.0,  0.0,  1.0,
		   0.0,  0.0,  1.0,
		   0.0,  0.0,  1.0,
		   0.0,  0.0,  1.0,
		  // Back
		   0.0,  0.0, -1.0,
		   0.0,  0.0, -1.0,
		   0.0,  0.0, -1.0,
		   0.0,  0.0, -1.0,
		  // Bottom
		   0.0, -1.0,  0.0,
		   0.0, -1.0,  0.0,
		   0.0, -1.0,  0.0,
		   0.0, -1.0,  0.0,
		  // Right
		   1.0,  0.0,  0.0,
		   1.0,  0.0,  0.0,
		   1.0,  0.0,  0.0,
		   1.0,  0.0,  0.0,
		  // Top
		   0.0,  1.0,  0.0,
		   0.0,  1.0,  0.0,
		   0.0,  1.0,  0.0,
		   0.0,  1.0,  0.0,
		  // Left
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0
		];

		var aryUV = [
			0.0,1.0,
			1.0,1.0,
			1.0,0.0,
			0.0,0.0,

			0.0,1.0,
			1.0,1.0,
			1.0,0.0,
			0.0,0.0,

			0.0,1.0,
			1.0,1.0,
			1.0,0.0,
			0.0,0.0,

			0.0,1.0,
			1.0,1.0,
			1.0,0.0,
			0.0,0.0,

			0.0,1.0,
			1.0,1.0,
			1.0,0.0,
			0.0,0.0,

			0.0,1.0,
			1.0,1.0,
			1.0,0.0,
			0.0,0.0
		];

		//..............................
		//push the data to the graphics card
		var mesh = gLoader.createMeshVAO("cube",trig,v,aryNorm,aryUV);
		return mesh;
	}

	static createModal(gLoader){
		var mesh = Cube.createMesh(gLoader,1,1,1);
		return new Modal(mesh);
	}
}