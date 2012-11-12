'use strict';

function isElementExists(e){
  while(e.parentNode){
	if(e.parentNode == document){
	  return true;
	}
	e=e.parentNode;
  }
  return false;
}


function getAuthorizationURL(redirectURL){
  return sprintf(AUTHORIZATION_URL_PATTERN, encodeURIComponent(encodeURIComponent(redirectURL || window.location)));
}


function getRandomString(length, alphabet){
  if(!alphabet){
	alphabet='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }
  var retval=[];
  for(i=0;i<length;i++){
	retval.push(alphabet.charAt(Math.random()*alphabet.length));
  }
  retval=retval.join('');
  return retval
}


/**
   @param n: Number.
   @param s: Splitting step. Optional. 3 by default.
   @return: E.g.: 12&nbsp;
*/
function getReadableNumber(n, s){
  n=''+n;
  s=s || 3;
  var retval=[];
  for(var i=0, j=n.length%s || s; i<n.length; i=j, j+=3){
	retval.push(n.slice(i, j));
  }
  retval=retval.join('&nbsp;');
  return retval;
}


/**
   @param a: Amount.
   @param vs: Variants in order ["one object", "two objects", "five objects", ].
*/
function choosePlural(a, vs){
  var retval;
  if(a%10 == 1 && a%100!=11){
	retval=0;
  }else if(a%10>=2 && a%10<=4 && (a%100<10 || a%100>=20)){
	retval=1;
  }else{
	retval=2;
  }
  retval=vs[retval];
  return retval;
}


function randomChoice(a){
  var retval;
  retval = Math.floor(Math.random() * a.length);
  retval = a[retval];
  return retval;
}


window.Cookie = {
  get: function(name, defaultValue){
	var cs = document.cookie.split(';'); // Cookies.
	var tc = ''; // Temp cookie.
	var cn = ''; // Cookie name.
	var cv = ''; // Cookie value.
	var retval;
	for (var i = 0; i<cs.length; i++){
	  tc = cs[i].split('=');
	  cn = tc[0].replace(/^\s+|\s+$/g, '');
	  if(cn == name){
		if(tc.length>1){
		  cv = unescape(tc[1].replace(/^\s+|\s+$/g, ''));
		}
		retval = cv;
		break;
	  }
	}
	if(retval == undefined){
	  retval = defaultValue;
	}
	return retval;
  }, 

  init: function(name, defaultValue){
	if(getCookie(name) == undefined){
	  setCookie(name, defaultValue);
	}
  }, 

  set: function(name, value, expires, path, domain, secure){
	var today = new Date();
	today.setTime(today.getTime());
	if(expires){
	  expires *= 1000 * 60 * 60 * 24;
	}
	var expiresDate = new Date(today.getTime()+(expires));
	document.cookie = name + '=' + escape(value) +
	  (expires ? ';expires=' + expiresDate.toGMTString() : '') +
	  (path ? ';path=' + path : '') +
	  (domain ? ';domain=' + domain : '') +
	  (secure ? ';secure' : '');
  }

};


_.mixin({
  reverse: function(array){
	var arrayLength = array.length
	for(var i=0; i<arrayLength / 2; i++){
	  var t = array[i];
	  array[i] = array[arrayLength - i - 1];
	  array[arrayLength - i - 1] = t;
	}
	return array;
  }
  
});


(function($){
  var SPRINTF_OBJ_PATTERN = /%(%|\((\w+)\)([sdf]))/g;

  var SPRINTF_LIST_PATTERN = /%([sdf%])/g;
  
  _.extend(String.prototype, {
	joinToCamel: function(delimiter){
	  return this.replace(
		new RegExp(
		  '(%s[a-z])'.sprintf(delimiter),
		  'g'
		),
		function($1){
		  return $1.charAt(1).toUpperCase();
		}
	  );
	}, 

	delimitCamel: function(delimiter){
	  return this.replace(
		  /([A-Z])/g, 
		function(match){
		  return delimiter + match.toLowerCase();
		}
	  );
	},
	
	getValue: function(){
	  var retval = this;
	  retval = retval.match(/^[\d.]+/);
	  retval = retval[0];
	  retval = Number(retval);
	  return retval;
	}, 

	shortify: function(length, suffix){
	  var retval = this;
	  if(suffix == undefined){
		suffix = '…';
	  }
	  if(length < retval.length){
		length -= suffix.length;
		while(length > 0 && retval.charCodeAt(length - 1) <= 0x20){
		  length--;
		}
		retval = retval.substr(0, length);
		retval += suffix;
	  }
	  return retval;
	}, 

	/**
	 * Python ``sprintf()``-style formatting implementation.
	 */
	sprintf: function(obj){
	  function cast(key, type){
		var retval = context[key];
		switch(type){
		case 'd':
		  retval = Math.floor(retval);
		  break;
		case 'f':
		  if(retval == Math.floor(retval)){
			retval += '.0';
		  }
		}
		return retval;
	  }

	  var context = obj;
	  var retval = this;
	  if(_.isArray(obj) || !_.isObject(obj) && (context = arguments)){
		var i = 0;
		retval = retval.replace(SPRINTF_LIST_PATTERN, function(s, type){
		  if(type == '%'){
			return '%';
		  }else{
			return cast(i++, type);
		  }
		});		
	  }else{
		retval = retval.replace(SPRINTF_OBJ_PATTERN, function(s, postPercentPart, key, type){
		  if(postPercentPart == '%'){
			return '%';
		  }else{
			return cast(key, type);
		  }
		});
	  }
	  return retval;
	}, 

	startsWith: function(s){
	  return this.indexOf(s) == 0;
	}, 

	toArray: function(){
	  var retval = [];
	  for(var i = 0; i<this.length; i++){
		retval.push(this.charAt(i));
	  }
	  return retval;
	},

	trim: function() {
	  var str = this.replace(/^\s+/, '');
	  for (var i = str.length - 1; i >= 0; i--) {
		if (/\S/.test(str.charAt(i))) {
		  str = str.substring(0, i + 1);
		  break;
		}
	  }
	  return str;
	}
	
  });
  
  function getPosition(e, el){
	var retval = e.pageX-el.get(0).offsetLeft; // Position.
	retval = retval<0?0:retval;
	var pmax = el.width(); // Maximal position.
	retval = retval>pmax?pmax:retval;
	return retval;
  }
  function onmousemove(e){
	this.whilescrolling.call(this.context, getPosition(e, this.el));
  }
  function onmouseup(e){
	this.wrapEl
	  .unbind('mouseup')
	  .unbind('mousemove')
	  .unbind('mouseout')
	;
	this.onfinishscrolling.call(this.context, getPosition(e, this.el));
  }
  function onmouseout(e){
	if(e.target == this.wrapEl.get(0)){
	  this.wrapEl
		.unbind('mouseup')
		.unbind('mousemove')
		.unbind('mouseout')
	  ;
	  this.onfinishscrolling.call(this.context, getPosition(e, this.el));
	}
  }
  function onmousedown(e){
	(this.wrapEl = $(document))
	  .mouseup(_.bind(
		onmouseup, 
		this
	  ))
	  .mousemove(_.bind(
		onmousemove, 
		this
	  ))
	  .mouseout(_.bind(
		onmouseout, 
		this
	  ))
	;
	this.onstartscrolling.call(this.context, getPosition(e, this.el));
  }
  /**
	 @param options: Options dict.
	 Possible options:
	 -context: Context for callbacks calling. If undefined, element'll be used as a context.
	 -onfinishscrolling(position): Will be fired when scrolling'll be finished. If undefined, whilescrolling'll be called.
	 -onstartscrolling(position): Will be fired when scrolling'll be started. If undefined, whilescrolling'll be called.
	 -whilescrolling(position): Will be fired until scrolling'll be finished.
  */
  $.fn.scrolling = function(options){
	options.el = this;
	options.onstartscrolling = options.onstartscrolling||options.whilescrolling;
	options.onfinishscrolling = options.onfinishscrolling||options.whilescrolling;
	options.context = options.context||this;
	this.mousedown(_.bind(
	  onmousedown, 
	  options
	));
  };
})(jQuery);

jQuery(function($){
  var TEMPLATES_CLASSES_SUFFIX = '-template';
  var templates = _.reduce(
	$('script[type = \'text/html\'][class$ = \'%s\']'.sprintf(TEMPLATES_CLASSES_SUFFIX)), 
	function(ts, e){
	  var k = $(e).attr('class');
	  k = k.slice(0, k.length-TEMPLATES_CLASSES_SUFFIX.length);
	  k = k.joinToCamel('-');
	  ts[k] = _.template($(e).html());
	  return ts;
	}, 
	{}
  );
  /**
	 @param os:: Options.
	 Possible options:
	 context: Template rendering context. Optional.
	 error: Error callback. Optional.
	 name: Template name.
	 success: Success callback.
  */
  templates.get = function(os){
	if(!os || !os.name || !os.success){
	  return;
	}
	if(!templates[os.name]){
	  os.error && os.error();
	}
	var r; // Result.
	try{
	  r = templates[os.name](os.data);
	  os.success(r)
	}catch(e){
	  os.error && os.error(e);
	}
  };
  window.templates = templates;
});
