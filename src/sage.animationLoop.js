sage.AnimationLoop = class{
	constructor(runFunc){
		this.isActive = false;
		this.lastframeTime = 0;

		var oThis = this;
		this.run = function(){
			var now = Date.now(),
				deltaTime = (now - oThis.lastframeTime) / 1000;
			oThis.lastframeTime = now;

			runFunc(deltaTime);
			if(oThis.isActive) requestAnimationFrame(oThis.run);
		}
	}

	start(){ this.isActive = true; this.run(); }
	stop(){ this.isActive = false; }
}