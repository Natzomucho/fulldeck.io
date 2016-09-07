(function(){function template1(it
/**/) {
var out='<div>'+(it.bar)+'</div><div>'+(it.foo)+'</div>';return out;
}function template2(param
/**/) {
var out='<div>'+(param.bar)+'</div><div class="'+(param.class)+'"></div>';return out;
}function two(it
/**/) {
var out='<div class="'+(it.class)+'"><div>'+(it.foo)+'</div><div>'+({bar:"hello", class:"hidden"}.bar)+'</div><div class="'+({bar:"hello", class:"hidden"}.class)+'"></div>'; var data = {bar:"world", class:"visible"}; out+='<div>'+(data.bar)+'</div><div class="'+(data.class)+'"></div></div>';return out;
}var itself=two, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());itself.template1=template1;itself.template2=template2;if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['two']=itself;}}());