(function(){
	grillo.addUtility('el', function(scope){
		self = this,
		document = window.document,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    toString = Object.prototype.toString,
    push = Array.prototype.push,
    slice = Array.prototype.slice,
    DOM_ELEMENT_NODE = 1,
    DOM_DOCUMENT_NODE = 9,
    readyStack = [],
    isReady = false,
    setReady = false,
    nodeType = document.nodeType
    forceSimpleSelectorEngine = false;

    /*
      Simplified DOM selection engine
      START ---------------------------------------------------------
    */
   	var parseChunks = function(stringSelector, contextNodes) {

      if (stringSelector === "" && contextNodes) {
         return contextNodes;
      }

      var chunks = stringSelector.split(" ");

      // Revise the context nodes
      var chunk = chunks.shift();
      var ctxNode;

      // Is the chunk an Id selector?
      if (chunk.charAt(0) == "#") {
         var idNode = document.getElementById(chunk.substring(1));
         ctxNode = idNode ? [idNode] : [];
      } else {

         var elName = chunk.charAt(0) !== "." ? chunk.split(".")[0] : "*";
         var classes = chunk.split(".");
         var attrs = null;

         // Remove any attributes from the element
         if (elName.indexOf("[") != -1) {
            attrs = elName;
            elName = elName.substr(0, elName.indexOf("["));
         }

         var cFn = function(node) {
            var aC = arguments.callee;
            if ((!aC.needClass || hasClasses(node, aC.classes)) &&
                (!aC.needAttribute || hasAttributes(node, aC.attributes))) {
               return node;
            }
         };

         // Find tags in the context of the element
         var cnodes = [];
         for (var cxn = 0; cxn < contextNodes.length; cxn++) {
            var x = contextNodes[cxn].getElementsByTagName(elName);
            for (var a = 0;a < x.length; a++) {
               cnodes.push(x[a]);
            }
         }
         if (classes) {
            classes.shift();
         }
         ctxNode = [];
         cFn.classes = classes;

         if (attrs != null) {
            var b1 = attrs.indexOf("[");
            var b2 = attrs.lastIndexOf("]");
            var as = attrs.substring(b1 + 1,b2);
            var attrib = as.split("][");
         }

         cFn.attributes = attrs != null ? attrib : null;
         cFn.needClass = (chunk.indexOf(".") != -1 && classes.length > 0);
         cFn.needAttribute = (attrs != null);

         for (var j = 0; j < cnodes.length; j++) {
            if (cFn(cnodes[j])) {
               ctxNode.push(cnodes[j]);
            }
         }
      }

      return parseChunks(chunks.join(" "), ctxNode);
   	};

   	var parseSelector = function(selector, context) {

      context = context || document;

      if (selector.nodeType && selector.nodeType === DOM_DOCUMENT_NODE) {
         selector = document.body;
         if (selector === null) {
            // Body not ready yet, return the document instead
            return [document];
         }
      }

      if (selector.nodeType && selector.nodeType === DOM_ELEMENT_NODE) {
         // Is the selector already a single DOM node?
         return [selector];
      }

      if (selector.jquery && typeof selector.jquery === "string") {
         // Is the selector a EL object?
         return selector.toArray();
      }

      if (context) {
         context = cleanUp(context);
      }

      if (EL.isArray(selector)) {
         // This is already an array of nodes
         return selector;
      } else if (typeof selector === "string") {

         // This is the meat and potatoes
         var nodes = [];
         for (var cN = 0; cN < context.length; cN++) {
            // For each context node, look for the
            // specified node within it
            var ctxNode = [context[cN]];
            if (!EL.forceSimpleSelectorEngine && ctxNode[0].querySelectorAll) {
               var nl = ctxNode[0].querySelectorAll(selector);
               for (var tni = 0; tni < nl.length; tni++) {
                  nodes.push(nl.item(tni));
               }
            } else {
               nodes = nodes.concat(parseChunks(selector, ctxNode));
            }
         }
         return nodes;
      } else {
         // What do you want me to do with this?
         return null;
      }
   	};

   	var hasClasses = function(node, cArr) {
      if (node.className.length == 0) {
         return false;
      }
      var cn = node.className.split(" ");
      var cC = cArr.length;
      for (var c = 0; c < cArr.length; c++) {
         if (EL.inArray(cArr[c], cn) != -1) {
            cC--;
         }
      }
      return (cC == 0);
   	};

   	var hasAttributes = function(node, attrs) {
      var satisfied = true;
      for (var i = 0; i < attrs.length; i++) {
         var tst = attrs[i].split("=");
         var op = (tst[0].indexOf("!") != -1 || tst[0].indexOf("*") != -1) ? tst[0].charAt(tst[0].length - 1) + "=" : "=";
         if (op != "=") {
            tst[0] = tst[0].substring(0, tst[0].length - 1);
         }
         switch (op) {
            case "=": satisfied &= (node.getAttribute(tst[0]) === tst[1]); break;
            case "!=": satisfied &= (node.getAttribute(tst[0]) !== tst[1]); break;
            case "*=": satisfied &= (node.getAttribute(tst[0]).indexOf(tst[1]) != -1); break;
            default: satisfied = false;
         }
      }
      return satisfied;
   	};

   	/*
      END -----------------------------------------------------------
      Simplified DOM selection engine
    */

    //internal utitities

    var makeObj = function(sel, val) {
		   var o = {};
		   o[sel] = val;
		   return o;
		};

		var cleanUp = function(els) {
		   if (els.nodeType && (els.nodeType === DOM_ELEMENT_NODE ||
		              els.nodeType === DOM_DOCUMENT_NODE)) {
		      els = [els];
		   } else if (typeof els === "string") {
		      els = EL(els).toArray();
		   } else if (els.jquery && typeof els.jquery === "string") {
		      els = els.toArray();
		   }
		   return els;
		};

		var getParentElem = function(str) {
		   var s = EL.trim(str).toLowerCase();
		   return s.indexOf("<option") == 0 ? "SELECT" :
		             s.indexOf("<li") == 0 ? "UL" :
		             s.indexOf("<tr") == 0 ? "TBODY" :
		             s.indexOf("<td") == 0 ? "TR" : "DIV";
		};

		var EL = function (s, e) {
			return new el().init(s, e);
		};

		/**
    * Loop over each object, performing the function for each one
    * @param obj
    * @param fn
    */
    EL.each = function(obj, fn) {
      var name, i = 0,
         length = obj.length,
         isObj = length === undefined || EL.isFunction(obj);

      if ( isObj ) {
         for ( name in obj ) {
            if ( fn.call( obj[ name ], name, obj[ name ] ) === false ) {
               break;
            }
         }
      } else {
         for ( var value = obj[0];
            i < length && fn.call( value, i, value ) !== false; value = obj[++i] ) {}
      }

      return obj;
    };

    /**
    * Test if the given object is a function
    * @param obj
    */
    EL.isFunction = function(obj) {
      return toString.call(obj) === "[object Function]";
    };

    /**
    * Merge two objects into one
    * @param first
    * @param second
    */
    EL.merge = function( first, second ) {
      var i = first.length, j = 0;

      if ( typeof second.length === "number" ) {
         for ( var l = second.length; j < l; j++ ) {
            first[ i++ ] = second[ j ];
         }
      } else {
         while ( second[j] !== undefined ) {
            first[ i++ ] = second[ j++ ];
         }
      }

      first.length = i;

      return first;
    };

    EL.param = function(params) {
      var pList = "";
      if (params) {
         EL.each(params, function(val, name) {
            pList += (pList.length != 0 ? "&" : "") + name + "=" + encodeURIComponent(val);
         });
      }
      return pList;
    };

    EL.evalScripts = function(scripts) {
      var head = document.getElementsByTagName("head")[0] || document.documentElement;
      for (var s = 0; s < scripts.length; s++) {

         var script = document.createElement("script");
         script.type = "text/javascript";

         if ( gSupportScriptEval ) {
            script.appendChild( document.createTextNode( scripts[s].text ) );
         } else {
            script.text = scripts[s].text;
         }

         // Use insertBefore instead of appendChild to circumvent an IE6 bug.
         // This arises when a base node is used (#2709).
         head.insertBefore( script, head.firstChild );
         head.removeChild( script );
      }
    };

		EL.toArray = function() {
		   return slice.call( this, 0 );
		};
		EL.data = function( elem, name, data ) {
		   if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
		      return;
		   }

		   elem = elem == window ?
		      windowData :
		      elem;

		   var id = elem[ expando ];

		   // Compute a unique ID for the element
		   if ( !id ) { id = elem[ expando ] = ++uuid; }

		   // Only generate the data cache if we're
		   // trying to access or manipulate it
		   if ( name && !jQuery.cache[ id ] ) {
		      jQuery.cache[ id ] = {};
		   }

		   // Prevent overriding the named cache with undefined values
		   if ( data !== undefined ) {
		      jQuery.cache[ id ][ name ] = data;
		   }

		   // Return the named cache data, or the ID for the element
		   return name ?
		      jQuery.cache[ id ][ name ] :
		      id;
		};

		EL.removeData = function( elem, name ) {
		   elem = elem == window ?
		      windowData :
		      elem;

		   var id = elem[ expando ];

		   // If we want to remove a specific section of the element's data
		   if ( name ) {
		      if ( jQuery.cache[ id ] ) {
		         // Remove the section of cache data
		         delete jQuery.cache[ id ][ name ];

		         // If we've removed all the data, remove the element's cache
		         name = "";

		         for ( name in jQuery.cache[ id ] )
		            break;

		         if ( !name ) {
		            jQuery.removeData( elem );
		         }
		      }

		   // Otherwise, we want to remove all of the element's data
		   } else {
		      // Clean up the element expando
		      try {
		         delete elem[ expando ];
		      } catch(e){
		         // IE has trouble directly removing the expando
		         // but it's ok with using removeAttribute
		         if ( elem.removeAttribute ) {
		            elem.removeAttribute( expando );
		         }
		      }

		      // Completely remove the data cache
		      delete jQuery.cache[ id ];
		   }
		};

		EL.makeArray = function( array, results ) {
		   var ret = results || [];
		   if ( array != null ) {
		      // The window, strings (and functions) also have 'length'
		      // The extra typeof function check is to prevent crashes
		      // in Safari 2 (See: #3039)
		      if ( array.length == null || typeof array === "string" || jQuery.isFunction(array) || (typeof array !== "function" && array.setInterval) ) {
		         push.call( ret, array );
		      } else {
		         EL.merge( ret, array );
		      }
		   }

		   return ret;
		};

		EL.inArray = function(e, arr) {
		   for (var a = 0; a < arr.length; a++) {
		      if (arr[a] === e) {
		         return a;
		      }
		   }
		   return -1;
		};

		EL.trim = function(str) {
		   if (str != null) {
		      return str.toString().replace(/^\s*|\s*$/g,"");
		   } else {
		      return "";
		   }
		};

		EL.isArray = function( obj ) {
		   return toString.call(obj) === "[object Array]";
		};

		var el = function () {};

	  el.prototype = {

	  	selector: "",
      context: null,
      length: 0,

	  	init : function (s, e) {
	  		var selectors;
				if ( typeof s !== "string" || !s ||
					nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

					return [];
				}
		    else if (s.indexOf(",") != -1) {
		       // Multiple selectors - split them
		       selectors = s.split(",");
		       for (var n = 0; n < selectors.length; n++) {
		          selectors[n] = EL.trim(selectors[n]);
		       }
		    } else {
		       selectors = [s];
		    }

		    var multi = [];
		    for (var m = 0; m < selectors.length; m++) {
		       multi = multi.concat(parseSelector(selectors[m], e));
		    }
		    els = multi;
		    push.apply(this, els);
		    return this;
	  	},

	  	// CORE

      each: function(fn) {
         return EL.each(this, fn);
      },

      size: function() {
         return this.length;
      },

      toArray: function() {
         return slice.call( this, 0 );
      },

      ready: function(fn) {
         if (isReady) {
            fn();
         } else {
            readyStack.push(fn);
            return this;
         }
      },

      data: function( key, value ) {
         if ( typeof key === "undefined" && this.length ) {
            return jQuery.data( this[0] );

         } else if ( typeof key === "object" ) {
            return this.each(function() {
               jQuery.data( this, key );
            });
         }

         var parts = key.split(".");
         parts[1] = parts[1] ? "." + parts[1] : "";

         if ( value === undefined ) {

            if ( data === undefined && this.length ) {
               data = jQuery.data( this[0], key );
            }
            return data === undefined && parts[1] ?
               this.data( parts[0] ) :
               data;
         } else {
            return this.each(function() {
               jQuery.data( this, key, value );
            });
         }
      },

      removeData: function( key ) {
         return this.each(function() {
            jQuery.removeData( this, key );
         });
      },

      // CSS

      addClass: function(cName) {
         return this.each(function() {
            if (this.className.length != 0) {
               var cn = this.className.split(" ");
               if (EL.inArray(cName, cn) == -1) {
                  cn.push(cName);
                  this.className = cn.join(" ");
               }
            } else {
               this.className = cName;
            }
         });
      },

      removeClass: function(cName) {
         return this.each(function() {
            if (this.className.length != 0) {
               var cn = this.className.split(" ");
               var i = EL.inArray(cName, cn);
               if (i != -1) {
                  cn.splice(i, 1);
                  this.className = cn.join(" ");
               }
            }
         });
      },

      hasClass: function(cName) {
         if (this[0].className.length == 0) {
            return false;
         }
         return EL.inArray(cName, this[0].className.split(" ")) != -1;
      },

      isElementName: function(eName) {
         return (this[0].nodeName.toLowerCase() === eName.toLowerCase());
      },

      toggleClass: function(cName) {
         return this.each(function() {
            if (this.className.length == 0) {
               this.className = cName;
            } else {
               var cn = this.className.split(" ");
               var i = EL.inArray(cName, cn);
               if (i != -1) {
                  cn.splice(i, 1);
               } else {
                  cn.push(cName);
               }
               this.className = cn.join(" ");
            }
         });
      },

      hide: function(fn) {
         return this.each(function() {
            if (this.style && this.style["display"] != null) {
               if (this.style["display"].toString() != "none") {
                  this._oldDisplay = this.style["display"].toString() || (this.nodeName != "span" ? "block" : "inline");
                  this.style["display"] = "none";
               }
            }
            if (EL.isFunction(fn)) {
               fn(this);
            }
         });
      },

      show: function(fn) {
         return this.each(function() {
            this.style["display"] = ((this._oldDisplay && this._oldDisplay != "" ? this._oldDisplay : null) || (this.nodeName != "span" ? "block" : "inline"));
            if (EL.isFunction(fn)) {
               fn(this);
            }
         });
      },

      css: function(sel, val) {
         if (typeof sel === "string" && val == null) {
            return this[0].style[fixStyleProp(sel)];
         } else {
            sel = typeof sel === "string" ? makeObj(sel,val) : sel;
            return this.each(function() {
               var self = this;
               if (typeof self.style != "undefined") {
                  EL.each(sel, function(key,value) {
                     value = (typeof value === "number" ? value + "px" : value);
                     var sn = fixStyleProp(key);
                     if (!self.style[sn]) {
                        sn = key;
                     }
                     self.style[sn] = value;
                  });
               }
            });
         }
      },

      // AJAX

      load: function(url, params, fn) {
         if (EL.isFunction(params)) {
            fn = params;
            params = {};
         }
         return this.each(function() {
            var wrapFn = function(data, status) {
               var aC = arguments.callee;
               if (data) {
                  // Strip out any scripts first
                  var o = stripScripts(data);
                  aC.elem.innerHTML = o.data;
                  EL.evalScripts(o.scripts);
               }
               if (EL.isFunction(aC.cback)) {
                  aC.cback(data, status);
               }
            };
            wrapFn.cback = fn;
            wrapFn.elem = this;
            EL.ajax.send(url, params, wrapFn);
         });
      },

      // HTML

      html: function(h) {
         if (!h) {
            return this[0].innerHTML;
         } else {
            return this.each(function() {
               var o = stripScripts(h);
               this.innerHTML = o.data;
               EL.evalScripts(o.scripts);
            });
         }
      },

      attr: function(name, value) {
         if (typeof name === "string" && value == null) {
            if (this[0]) {
               return this[0].getAttribute(name);
            } else {
               return "";
            }
         } else {
            return this.each(function() {
               name = typeof name === "string" ? makeObj(name,value) : name;
               for (var i in name) {
                  var v = name[i];
                  this.setAttribute(i,v);
               }
            });
         }
      },

      eq: function(index) {
         var elms = this.toArray();
         var elm = index < 0 ? elms[elms.length + index] : elms[index];
         this.context = this[0] = elm;
         this.length = 1;
         return this;
      },

      first: function() {
         var elms = this.toArray();
         this.context = this[0] = elms[0];
         this.length = 1;
         return this;
      },

      last: function() {
         var elms = this.toArray();
         this.context = this[0] = elms[elms.length - 1];
         this.length = 1;
         return this;
      },

      index: function(selector) {
         var idx = -1;
         if (this.length != 0) {
            var itm = this[0];
            if (!selector) {
               var parent = this.parent();
               var s = parent[0].firstChild;
               var arr = [];
               while (s != null) {
                  if (s.nodeType === DOM_ELEMENT_NODE) {
                     arr.push(s);
                  }
                  s = s.nextSibling;
               }
               EL.each(s, function(i) {
                  if (this === itm) {
                     idx = i;
                     return false;
                  }
               });
            } else {
               var elm = EL(selector)[0];
               this.each(function(i) {
                  if (this === elm) {
                     idx = i;
                     return false;
                  }
               });
            }
         }
         return idx;
      },

      next: function(selector) {
         var arr = [];
         if (!selector) {
            this.each(function() {
               var elm = this.nextSibling;
               while (elm != null && elm.nodeType !== DOM_ELEMENT_NODE) {
                  elm = elm.nextSibling;
               }
               if (elm != null) {
                  arr.push(elm);
               }
            });
         } else {
            var pElm = EL(selector);
            this.each(function() {
               var us = this.nextSibling;
               while (us != null && us.nodeType !== DOM_ELEMENT_NODE) {
                  us = us.nextSibling;
               }
               if (us != null) {
                  var found = false;
                  pElm.each(function() {
                     if (this == us) {
                        found = true;
                        return false;
                     }
                  });
                  if (found) {
                     arr.push(us);
                  }
               }
            });
         }
         return EL(arr);
      },

      prev: function(selector) {
         var arr = [];
         if (!selector) {
            this.each(function() {
               var elm = this.previousSibling;
               while (elm != null && elm.nodeType !== DOM_ELEMENT_NODE) {
                  elm = elm.previousSibling;
               }
               if (elm != null) {
                  arr.push(elm);
               }
            });
         } else {
            var pElm = EL(selector);
            this.each(function() {
               var us = this.previousSibling;
               while (us != null && us.nodeType !== DOM_ELEMENT_NODE) {
                  us = us.previousSibling;
               }
               if (us != null) {
                  var found = false;
                  pElm.each(function() {
                     if (this == us) {
                        found = true;
                        return false;
                     }
                  });
                  if (found) {
                     arr.push(us);
                  }
               }
            });
         }
         return EL(arr);
      },

      parent: function(selector) {
         var arr = [];
         if (!selector) {
            this.each(function() {
               arr.push(this.parentNode);
            });
         } else {
            var pElm = EL(selector);
            this.each(function() {
               var us = this.parentNode;
               var found = false;
               pElm.each(function() {
                  if (this == us) {
                     found = true;
                     return false;
                  }
               });
               if (found) {
                  arr.push(us);
               }
            });
         }
         return EL(arr);
      },

      parents: function(selector) {
         var arr = [];
         if (!selector) {
            this.each(function() {
               var us = this;
               while (us != document.body) {
                  us = us.parentNode;
                  arr.push(us);
               }
            });
         } else {
            var pElm = EL(selector);
            this.each(function() {
               var us = this;
               while (us != document.body) {
                  pElm.each(function() {
                     if (this == us) {
                        arr.push(us);
                     }
                  });
                  us = us.parentNode;
               }
            });
         }
         return EL(arr);
      },

      children: function(selector) {
         var arr = [];
         if (!selector) {
            this.each(function() {
               var us = this.firstChild;
               while (us != null) {
                  if (us.nodeType == DOM_ELEMENT_NODE) {
                     arr.push(us);
                  }
                  us = us.nextSibling;
               }
            });
         } else {
            var cElm = EL(selector);
            this.each(function() {
               var us = this.firstChild;
               while (us != null) {
                  if (us.nodeType == DOM_ELEMENT_NODE) {
                     cElm.each(function() {
                        if (this === us) {
                           arr.push(us);
                        }
                     });
                  }
                  us = us.nextSibling;
               }
            });
         }
         return EL(arr);
      },

      append: function(child) {
         child = cleanUp(child);
         return this.each(function() {
            for (var i = 0; i < child.length; i++) {
               this.appendChild(child[i]);
            }
         });
      },

      remove: function(els) {
         return this.each(function() {
            if (els) {
               $(els, this).remove();
            } else {
               var par = this.parentNode;
               par.removeChild(this);
            }
         });
      },

      val: function(value) {
         if (value == null) {
            var v = null;
            if (this && this.length != 0 && typeof this[0].value != "undefined") {
               v = this[0].value;
            }
            return v;
         } else {
            return this.each(function() {
               if (typeof this.value != "undefined") {
                  this.value = value;
               }
            });
         }
      },

      // EVENTS

      bind: function(eType, fn) {
         return this.each(function() {
            setHandler(this, eType, fn);
         });
      },

      trigger: function(eType, data) {
         return this.each(function() {
            return fireEvent(this, eType, data);
         });
      },

      submit: function(fn) {
         return this.each(function() {
            if (EL.isFunction(fn)) {
               setHandler(this, "onsubmit", fn);
            } else {
               if (this.submit) {
                  this.submit();
               }
            }
         });
      }

	  };

	  return function(s, e){
	        var jQuery = ("jQuery" in window) ? window.jQuery : false;
	        //console.log(jQuery);
	        if (jQuery && jQuery.fn.on) {
	        	return  window.jQuery(s);
	        } else{
	        	// window.jQuery = function (s, e) {
	        	// 	return EL(s, e);
	        	// };
	        	// window.$ = function (s, e) {
	        	// 	return EL(s, e);
	        	// };
	        	// // window.jQuery = EL;
	        	// // window.$ = EL;
	        	return EL(s, e);
	        };

	  }

	});
}());
