/*
rloop = new RenderLoop(function(dt){ 
	console.log(rloop.fps + " " + dt);
},10).start();
*/

class RenderLoop{
	////http://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/
	constructor(callback,fps){
		var oThis = this;
		this.msLastFrame = null;
		this.callBack = callback;
		this.isActive = false;
		this.fps = 0;

		if(fps > 0){ //Build a run method that limits the framerate
			this.msFpsLimit = 1000/fps; //Calc how many MS per frame in one second of time.
			this.run = function(){
				//Calculate Deltatime between frames and the FPS currently.
				var msCurrent	= performance.now(),
					msDelta		= (msCurrent - oThis.msLastFrame),
					deltaTime	= msDelta / 1000.0;
				
				if(msDelta >= oThis.msFpsLimit){ //Now execute frame since the time has elapsed.
					oThis.fps			= Math.floor(1/deltaTime);
					oThis.msLastFrame	= msCurrent;
					oThis.callBack(deltaTime);
				}

				if(oThis.isActive) window.requestAnimationFrame(oThis.run);
			}
		}else{ //Else build a run method thats optimised as much as possible.
			this.run = function(){
				//Calculate Deltatime between frames and the FPS currently.
				var msCurrent	= performance.now(),
					deltaTime	= (msCurrent - oThis.msLastFrame) / 1000.0;

				//Now execute frame since the time has elapsed.
				oThis.fps			= Math.floor(1/deltaTime);
				oThis.msLastFrame	= msCurrent;

				oThis.callBack(deltaTime);
				if(oThis.isActive) window.requestAnimationFrame(oThis.run);
			}
		}
	}

	start(){
		this.isActive = true;
		this.msLastFrame = performance.now();
		window.requestAnimationFrame(this.run);
		return this;
	}

	stop(){ this.isActive = false; }
}