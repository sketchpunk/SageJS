/* Cube Notes

(-1, 1)( 1, 1)   ( 1, 1)(-1, 1)
(-1,-1)( 1,-1)   ( 1,-1)(-1,-1)

Front   Back  //to keep the pattern, the back needs to flip its horizontal positions so not to get culled.
3  2    7  6   
0  1    4  5

bot    left   Top    Right
0  1   2  7   6  7   6  3
5  4   1  4   3  2   5  0

Triangle Pattern for square [0,1,2] [2,3,0]
*/

class CubeMesh{
	constructor(cgl,width,height,depth){
		//determine the size of the cube in 3d Space with the origin at its center.
		var w = width/2.0, h = height/2.0, d = depth/2.0;

		//..............................
		//Create the front and back face based on the size
		this.v = [ -w, -h,  d,	// 0
					w, -h,  d,	// 1
					w,  h,  d,	// 2
				   -w,  h,  d,	// 3

				    w, -h,  -d,	// 4
				   -w, -h,  -d,	// 5
				   -w,  h,  -d,	// 6
				    w,  h,  -d	// 7
				];

		this.transform = new sage.webgl.Transform();
		this.trig = [];		//Holds the triangle indexes, each square face is 6 floats
		this.colors = [];	//Hold the color for all the vertices of the square, RGBA (4 floats per vertex);

		//..............................
		//Using the 8 points that create the front and back face, create the remaining 4 faces
		//Vector index used to determine how each face is built.
		var ind = 0, bldFaceAry = [5,4,1,0, 1,4,7,2, 3,2,7,6, 5,0,3,6];
		for(var i=0; i < bldFaceAry.length; i++){
			ind = bldFaceAry[i] * 3;
			this.v.push(this.v[ ind ]);
			this.v.push(this.v[ ind+1 ]);
			this.v.push(this.v[ ind+2 ]);
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
		this.cubeVertBuffer	= cgl.createArrayBuffer(this.v);			
		this.colorBuffer	= cgl.createArrayBuffer(this.colors);		
		this.cubeIndexBuf	= cgl.createElmAryBuffer(this.trig);

		//cgl.gl.bindBuffer(cgl.mGL.ELEMENT_ARRAY_BUFFER, this.cubeIndexBuf );
	}

	draw(cgl){
		cgl.gl.drawElements(cgl.gl.TRIANGLES, this.trig.length, cgl.gl.UNSIGNED_SHORT, 0);
	}
}

/*
function debug(){
	var txt = "";
	for(var i=0; i < arguments.length; i++){
		txt += arguments[i] + " : ";
	}
	console.log(txt);
}
*/