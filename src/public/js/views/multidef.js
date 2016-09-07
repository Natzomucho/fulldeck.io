(function(){function template1(it
/**/) {
var out='<div>'+(it.bar)+'</div><div>'+(it.foo)+'</div>';return out;
}function template2(param
/**/) {
var out='<div>'+(param.bar)+'</div><div class="'+(param.class)+'"></div>';return out;
}function multidef(it
/**/) {
var out='';return out;
}var itself=multidef, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());itself.template1=template1;itself.template2=template2;if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['multidef']=itself;}}());