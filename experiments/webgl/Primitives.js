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