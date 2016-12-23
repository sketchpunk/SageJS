var sage = sage || {};
sage.ui = {};

sage.ui.newElm = function(elmName,txt,cls,root){
	var elm = document.createElement(elmName);
	if(root !== undefined && root != null) root.appendChild(elm);
	if(txt != null) elm.innerHTML = txt;
	if(cls !== undefined && cls != null) elm.className = cls;
	return elm;
};

sage.ui.newInput = function(sType,sName,eValue,root){
	var elm = document.createElement("input");
	elm.type = sType;
	if(sName != null) elm.name = sName;
	if(eValue !== undefined && eValue != null) elm.value = eValue;
	if(root !== undefined && root != null) root.appendChild(elm);
	return elm;
};

sage.ui.newImg = function(src,cls,root){
	var elm = document.createElement("img");
	if(src != null) elm.src = src;
	if(cls != null) elm.className = cls;
	if(root !== undefined && root != null) root.appendChild(elm);
	return elm;
};