class CubeMesh{
	constructor(cgl,width,height,depth){
		//determine the size of the cube in 3d Space with the origin at its center.
		var w = width/2.0, h = height/2.0, d = depth/2.0;

		//..............................
		//Create the front face based on the size, then generate the back by changing Z
		this.v = [ -w, -h, d,
					w, -h, d,
					w, h, d,
					-w, h, d ];
		var vertLen = this.v.length;
		for(var i=0; i < vertLen; i++) this.v.push((i%3 != 2)? this.v[i] : -this.v[i] );

		this.trig = [];		//Holds the triangle indexes, each square face is 6 floats
		this.colors = [];	//Hold the color for all the vertices of the square, RGBA (4 floats per vertex);

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
				this.v.push(this.v[ ind ]);
				this.v.push(this.v[ ind+1 ]);
				this.v.push(this.v[ ind+2 ]);
			}
		}

		//..............................
		//Create all the triangles for the cube [0,1,2] [2,3,0]
		var vectorCnt = this.v.length/ 3;
		for(var i=0; i < vectorCnt; i+=2){
			this.trig.push(i);
			this.trig.push(i+1);
			this.trig.push( (Math.floor(i/4)*4)+((i+2)%4) );
		}

		//..............................
		//Create a random color for each face of the cube.
		var r,g,b;
		for(var i=0; i < vectorCnt/4; i++){
			r = sage.math.randomRng(0,1);
			g = sage.math.randomRng(0,1);
			b = sage.math.randomRng(0,1);

			for(var x=0; x < 4; x++){
				this.colors.push(r);
				this.colors.push(g);
				this.colors.push(b);
				this.colors.push(1.0);
			}
		}

		//..............................
		//push the data to the graphics card
		this.cubeVertBuffer = cgl.createBuffer(this.v);			
		this.colorBuffer = cgl.createBuffer(this.colors);		
		this.cubeIndexBuf = cgl.createElmAryBuffer(this.trig);

		//cgl.mGL.bindBuffer(cgl.mGL.ELEMENT_ARRAY_BUFFER, this.cubeIndexBuf );
	}

	draw(cgl){
		cgl.mGL.drawElements(cgl.mGL.TRIANGLES, this.trig.length, cgl.mGL.UNSIGNED_SHORT, 0);
	}
}