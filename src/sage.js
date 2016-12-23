var sage = sage || {};

sage.Delegate = function(obj,funcRef){
	var args = null;
	if(arguments.length > 2){ args = []; for(var i=2; i < arguments.length; i++) args.push(arguments[i]); }
	return function(){
		if(args == null) funcRef.apply(obj,arguments);
		else{
			var params = args.slice(); //Need to make a copy of args, When just adding to args caused a problem with bubbling events.
			for(var i=0; i < arguments.length; i++) params.push(arguments[i]);
			funcRef.apply(obj,params);
		}
	};
};

sage.uuid = function(){
    var dt = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function") dt += performance.now(); //use high-precision timer if available
    
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}


/*######################################################################
Custom Event Handler */

/*EXAMPLE CODE
var tObj = {val:"woot",func:function(){ console.log(this.val); console.log(arguments); }}

var evt = new Sage.EventManager("onprogress","oncomplete");
evt.addEventListener("onprogress",function(){ console.log(arguments); });
evt.addEventListenerDelegate("onprogress",tObj,tObj.func);

evt.dispatchEvent("onprogress",[1,3]);
*/

sage.EventManager = class{
	constructor(){
		this.Handlers = {};
		for(var i=0; i < arguments.length; i+=1) this.Handlers[arguments[i]] = [];
	}

	addEventListener(evtName,funcHandler){
		if(this.Handlers[evtName] === undefined) return false;
		this.Handlers[evtName].push(funcHandler);
		return true;
	}

	addEventListenerDelegate(evtName,objRef,funcHandler){
		if(this.Handlers[evtName] === undefined) return false;

		this.Handlers[evtName].push(function(){ funcHandler.apply(objRef,arguments); });
		return true;
	}

	dispatchEvent(evtName,ary){
		for(var i = 0; i < this.Handlers[evtName].length; i++){
			try{
				this.Handlers[evtName][i].apply(this,ary);
			}catch(err){
				console.log("error dispatching event");
				console.log(err);
			}
		}
	}
}


