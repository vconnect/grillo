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
         // Is the selector a jQL object?
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
			var selectors;
	    if (s.indexOf(",") != -1) {
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
	    //push.apply(this, els);
	    return els;
		}

		EL.prototype.toArray = function() {
		   return slice.call( this, 0 );
		};
		EL.prototype.data = function( elem, name, data ) {
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

		EL.prototype.removeData = function( elem, name ) {
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

		EL.prototype.makeArray = function( array, results ) {
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

		EL.prototype.inArray = function(e, arr) {
		   for (var a = 0; a < arr.length; a++) {
		      if (arr[a] === e) {
		         return a;
		      }
		   }
		   return -1;
		};

		EL.prototype.trim = function(str) {
		   if (str != null) {
		      return str.toString().replace(/^\s*|\s*$/g,"");
		   } else {
		      return "";
		   }
		};
		EL.isArray = function( obj ) {
		   return toString.call(obj) === "[object Array]";
		};

	  return function(s, e){
	        var jQuery = ("jQuery" in window) ? window.jQuery : false;
	        //console.log(jQuery);
	        if (jQuery && jQuery.fn.on) {
	        	return jQuery(s);
	        } else{
	        	return EL(s, e);
	        };

	  }
	});
}());
