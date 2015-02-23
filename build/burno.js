

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self) {

// Full polyfill for browsers with no classList support
if (!("classList" in document.createElement("_"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
    classListProp = "classList"
  , protoProp = "prototype"
  , elemCtrProto = view.Element[protoProp]
  , objCtr = Object
  , strTrim = String[protoProp].trim || function () {
    return this.replace(/^\s+|\s+$/g, "");
  }
  , arrIndexOf = Array[protoProp].indexOf || function (item) {
    var
        i = 0
      , len = this.length
    ;
    for (; i < len; i++) {
      if (i in this && this[i] === item) {
        return i;
      }
    }
    return -1;
  }
  // Vendors: please allow content code to instantiate DOMExceptions
  , DOMEx = function (type, message) {
    this.name = type;
    this.code = DOMException[type];
    this.message = message;
  }
  , checkTokenAndGetIndex = function (classList, token) {
    if (token === "") {
      throw new DOMEx(
          "SYNTAX_ERR"
        , "An invalid or illegal string was specified"
      );
    }
    if (/\s/.test(token)) {
      throw new DOMEx(
          "INVALID_CHARACTER_ERR"
        , "String contains an invalid character"
      );
    }
    return arrIndexOf.call(classList, token);
  }
  , ClassList = function (elem) {
    var
        trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
      , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
      , i = 0
      , len = classes.length
    ;
    for (; i < len; i++) {
      this.push(classes[i]);
    }
    this._updateClassName = function () {
      elem.setAttribute("class", this.toString());
    };
  }
  , classListProto = ClassList[protoProp] = []
  , classListGetter = function () {
    return new ClassList(this);
  }
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
  return this[i] || null;
};
classListProto.contains = function (token) {
  token += "";
  return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
  ;
  do {
    token = tokens[i] + "";
    if (checkTokenAndGetIndex(this, token) === -1) {
      this.push(token);
      updated = true;
    }
  }
  while (++i < l);

  if (updated) {
    this._updateClassName();
  }
};
classListProto.remove = function () {
  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
    , index
  ;
  do {
    token = tokens[i] + "";
    index = checkTokenAndGetIndex(this, token);
    while (index !== -1) {
      this.splice(index, 1);
      updated = true;
      index = checkTokenAndGetIndex(this, token);
    }
  }
  while (++i < l);

  if (updated) {
    this._updateClassName();
  }
};
classListProto.toggle = function (token, force) {
  token += "";

  var
      result = this.contains(token)
    , method = result ?
      force !== true && "remove"
    :
      force !== false && "add"
  ;

  if (method) {
    this[method](token);
  }

  if (force === true || force === false) {
    return force;
  } else {
    return !result;
  }
};
classListProto.toString = function () {
  return this.join(" ");
};

if (objCtr.defineProperty) {
  var classListPropDesc = {
      get: classListGetter
    , enumerable: true
    , configurable: true
  };
  try {
    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
  } catch (ex) { // IE 8 doesn't support enumerable:true
    if (ex.number === -0x7FF5EC54) {
      classListPropDesc.enumerable = false;
      objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
    }
  }
} else if (objCtr[protoProp].__defineGetter__) {
  elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
  "use strict";

  var testElement = document.createElement("_");

  testElement.classList.add("c1", "c2");

  // Polyfill for IE 10/11 and Firefox <26, where classList.add and
  // classList.remove exist but support only one argument at a time.
  if (!testElement.classList.contains("c2")) {
    var createMethod = function(method) {
      var original = DOMTokenList.prototype[method];

      DOMTokenList.prototype[method] = function(token) {
        var i, len = arguments.length;

        for (i = 0; i < len; i++) {
          token = arguments[i];
          original.call(this, token);
        }
      };
    };
    createMethod('add');
    createMethod('remove');
  }

  testElement.classList.toggle("c3", false);

  // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
  // support the second argument.
  if (testElement.classList.contains("c3")) {
    var _toggle = DOMTokenList.prototype.toggle;

    DOMTokenList.prototype.toggle = function(token, force) {
      if (1 in arguments && !this.contains(token) === !force) {
        return force;
      } else {
        return _toggle.call(this, token);
      }
    };

  }

  testElement = null;
}());

}

}
// ECMA-262, Edition 5, 15.4.4.18
// Référence: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this vaut null ou n est pas défini');
    }

    // 1. Soit O le résultat de l'appel à ToObject
    //    auquel on a passé |this| en argument.
    var O = Object(this);

    // 2. Soit lenValue le résultat de l'appel de la méthode
    //    interne Get sur O avec l'argument "length".
    // 3. Soit len la valeur ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. Si IsCallable(callback) est false, on lève une TypeError.
    // Voir : http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' n est pas une fonction');
    }

    // 5. Si thisArg a été fourni, soit T ce thisArg ;
    //    sinon soit T égal à undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Soit k égal à 0
    k = 0;

    // 7. On répète tant que k < len
    while (k < len) {

      var kValue;

      // a. Soit Pk égal ToString(k).
      //   (implicite pour l'opérande gauche de in)
      // b. Soit kPresent le résultat de l'appel de la
      //    méthode interne HasProperty de O avec l'argument Pk.
      //    Cette étape peut être combinée avec c
      // c. Si kPresent vaut true, alors
      if (k in O) {

        // i. Soit kValue le résultat de l'appel de la
        //    méthode interne Get de O avec l'argument Pk.
        kValue = O[k];

        // ii. On appelle la méthode interne Call de callback
        //     avec T comme valeur this et la liste des arguments
        //     qui contient kValue, k, et O.
        callback.call(T, kValue, k, O);
      }
      // d. On augmente k de 1.
      k++;
    }
    // 8. on renvoie undefined
  };
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      var kValue;
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// De MDN - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

// /* Simple JavaScript Inheritance
//  * By John Resig http://ejohn.org/
//  * MIT Licensed.
//  */
// // Inspired by base2 and Prototype
(function ()
{
    "use strict";

    window.copy = function(object)
    {
        var c = null;

        if(!object || typeof (object) !== 'object' || (typeof HTMLElement !== 'undefined' && object instanceof HTMLElement) || object instanceof Class || (typeof THREE !== 'undefined' && object instanceof THREE.Object3D) || (typeof jQuery !== 'undefined' && object instanceof jQuery))
        {
            return object;
        }
        else if(object instanceof Array)
        {
            c = [];
            for(var i = 0, l = object.length; i < l; i++)
            {
                c[i] = copy(object[i]);
            }

            return c;
        }
        else
        {
            c = {};
            for(var i in object)
            {
                c[i] = copy(object[i]);
            }

            return c;
        }
    };

    window.merge = function (original, extended)
    {
          for(var key in extended)
          {
              var ext = extended[key];
              if(typeof (ext) !== 'object' || ext instanceof HTMLElement || ext instanceof Class || (typeof THREE !== 'undefined' && ext instanceof THREE.Object3D) || (typeof ext !== 'undefined' && ( typeof jQuery !== 'undefined' && ext instanceof jQuery)))
              {
                  original[key] = ext;
              }
              else
              {
                  if(!original[key] || typeof (original[key]) !== 'object')
                  {
                      original[key] = (ext instanceof Array) ? [] : {};
                  }
                  merge(original[key], ext);
              }
          }
          return original;
      };

    var initializing = false,
        fnTest = /xyz/.test(function () {
            xyz;
        }) ? /\b_super\b/ : /.*/;
    window.Class = function () {};
    var inject = function (prop) {
        var proto = this.prototype;
        var _super = {};
        for(var name in prop)
        {
            if(typeof (prop[name]) === "function" && typeof (proto[name]) === "function" && fnTest.test(prop[name]))
            {
                _super[name] = proto[name];
                proto[name] = (function (name, fn)
                {
                    return function()
                    {
                        var tmp     = this._super;
                        this._super = _super[name];
                        var ret     = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name, prop[name]);
            }
            else
            {
                proto[name] = prop[name];
            }
        }
    };
    window.Class.extend = function(prop)
    {
        var _super    = this.prototype;
        initializing  = true;
        var prototype = new this();
        initializing  = false;
        for(var name in prop)
        {
            if(typeof (prop[name]) === "function" && typeof (_super[name]) === "function" && fnTest.test(prop[name]))
            {
                prototype[name] = (function(name, fn)
                {
                    return function()
                    {
                        var tmp     = this._super;
                        this._super = _super[name];
                        var ret     = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name, prop[name]);
            }
            else
            {
                prototype[name] = prop[name];
            }
        }

        function Class() {
            if(!initializing)
            {
                if(this.static_instantiate)
                {
                    var obj = this.static_instantiate.apply(this, arguments);
                    if (obj)
                    {
                        return obj;
                    }
                }
                for(var p in this)
                {
                    if (typeof (this[p]) === 'object')
                    {
                        this[p] = copy(this[p]);
                    }
                }
                if(this.init)
                {
                    this.init.apply(this, arguments);
                }
            }
            return this;
        }
        Class.prototype             = prototype;
        Class.prototype.constructor = Class;
        Class.extend                = window.Class.extend;
        Class.inject                = inject;
        return Class;
    };
})();

var B =
{
    Core       : {},
    Tools      : {},
    Components : {}
};

(function()
{
    'use strict';

    B.Core.Abstract = Class.extend(
    {
        options: {},

        /**
         * INIT
         */
        init : function( options )
        {
            if( typeof options === 'undefined' )
                options = {};

            this.$ = {};

            this.options = merge( this.options,options );
        },

        /**
         * START
         */
        start : function()
        {

        },

        /**
         * IGNITE DAT FIRE!
         */
        ignite : function()
        {
            return this.start();
        },

        /**
         * DESTROY
         */
        destroy : function()
        {

        }
    } );
} )();

(function()
{
    'use strict';

    B.Core.Event_Emitter = B.Core.Abstract.extend(
    {
        options: {},

        /**
         * INIT
         */
        init : function( options )
        {
            this._super( options );

            this.callbacks      = {};
            this.callbacks.base = {};
        },

        /**
         * ON
         */
        on : function( name, action )
        {
            // Errors
            if( typeof name === 'undefined' || name === '' )
            {
                console.warn( 'Wrong name' );
                return false;
            }

            if( typeof action === 'undefined' )
            {
                console.warn( 'Wrong action' );
                return false;
            }

            var that  = this,
                names = [];

            // Clean
            name  = name.replace( /[^a-zA-Z0-9 ,\/.]/g,'' );
            name  = name.replace( /[,\/]+/g,' ' );

            // Split
            names = name.split( ' ' );

            // Each name
            names.forEach( function( name )
            {
                name = that.resolve_name( name );

                // Create tag if not exist
                if( !( that.callbacks[ name.tag ] instanceof Object ) )
                    that.callbacks[ name.tag ] = {};

                // Create action if not exist
                if( !( that.callbacks[ name.tag ][ name.value ] instanceof Array ) )
                    that.callbacks[ name.tag ][ name.value ] = [];

                // Add action
                that.callbacks[ name.tag ][ name.value ].push( action );
            });

            return this;
        },

        /**
         * OFF
         */
        off : function( name )
        {
            // Errors
            if( typeof name === 'undefined' || name === '' )
            {
                console.warn( 'Wrong name' );
                return false;
            }

            var that  = this,
                names = [];

            // Clean
            name  = name.replace( /[^a-zA-Z0-9 ,\/.]/g,'' );
            name  = name.replace( /[,\/]+/g,' ' );

            // Split
            names = name.split( ' ' );

            // Each name
            names.forEach( function( name )
            {
                name = that.resolve_name( name );

                // Remove tag
                if( name.tag !== 'base' && name.value === '' )
                {
                    delete that.callbacks[name.tag];
                }

                // Remove specific action in tag
                else
                {
                    // Default
                    if( name.tag === 'base' )
                    {
                        // Try to remove from each tag
                        for( var tag in that.callbacks )
                        {
                            if( that.callbacks[ tag ] instanceof Object && that.callbacks[ tag ][ name.value ] instanceof Array )
                            {
                                delete that.callbacks[ tag ][ name.value ];

                                // Remove tag if empty
                                if( Object.keys(that.callbacks[ tag ] ).length === 0 )
                                    delete that.callbacks[ tag ];
                            }
                        }
                    }

                    // Specified tag
                    else if( that.callbacks[ name.tag ] instanceof Object && that.callbacks[ name.tag ][ name.value ] instanceof Array )
                    {
                        delete that.callbacks[ name.tag ][ name.value ];

                        // Remove tag if empty
                        if( Object.keys( that.callbacks[ name.tag ] ).length === 0 )
                            delete that.callbacks[ name.tag ];
                    }
                }
            });

            return this;
        },

        /**
         * TRIGGER
         */
        trigger : function( name, args )
        {
            // Errors
            if( typeof name === 'undefined' || name === '' )
            {
                console.warn( 'Wrong name' );
                return false;
            }

            var that         = this,
                final_result = undefined,
                result       = undefined;

            // Default args
            if( !( args instanceof Array ) )
                args = [];

            name = that.resolve_name( name );

            // Clean (need some work)
            name.value = name.value.replace( /[^a-zA-Z0-9 ,\/.]/g, '' );
            name.value = name.value.replace( /[,\/]+/g, ' ' );

            // Default tag
            if( name.tag === 'base' )
            {
                // Try to find action in each tag
                for( var tag in that.callbacks )
                {
                    if( that.callbacks[ tag ] instanceof Object && that.callbacks[ tag ][ name.value ] instanceof Array )
                    {
                        that.callbacks[ tag ][ name.value ].forEach( function( action )
                        {
                            result = action.apply( that,args );

                            if( typeof final_result === 'undefined' )
                                final_result = result;
                        } );
                    }
                }
            }

            // Specified tag
            else if( this.callbacks[ name.tag ] instanceof Object )
            {
                if( name.value === '' )
                {
                    console.warn( 'Wrong name' );
                    return this;
                }

                that.callbacks[ name.tag ][ name.value ].forEach( function( action )
                {
                    result = action.apply( that, args );

                    if( typeof final_result === 'undefined' )
                        final_result = result;
                });
            }

            return final_result;
        },

        /**
         * TRIGGA NIGGA WUT
         */
        trigga : function( name, args )
        {
            return this.trigger( name, args );
        },

        /**
         * CLEAN NAME
         */
        clean_name : function( name )
        {
            name = name.toLowerCase();
            name = name.replace( '-', '_' );

            return name;
        },

        /**
         * RESOLVE NAME
         */
        resolve_name : function( name )
        {
            var new_name = {},

            parts = name.split( '.' );

            new_name.original = name;
            new_name.value    = parts[ 0 ];
            new_name.tag      = 'base'; // Base tag

            // Specified tag
            if( parts.length > 1 && parts[ 1 ] !== '' )
                new_name.tag = parts[ 1 ];

            return new_name;
        }
    } );
} )();

(function()
{
    'use strict';

    B.Tools.Mouse = B.Core.Event_Emitter.extend(
    {
        /**
         * STATIC INSTANTIATE (SINGLETON)
         */
        static_instantiate : function()
        {
            if( B.Tools.Mouse.prototype.instance === null )
                return null;
            else
                return B.Tools.Mouse.prototype.instance;
        },

        /**
         * INIT
         */
        init : function( options )
        {
            this._super( options );

            this.browser          = new B.Tools.Browser();
            this.down             = false;
            this.position         = {};
            this.position.x       = 0;
            this.position.y       = 0;
            this.position.ratio   = {};
            this.position.ratio.x = 0;
            this.position.ratio.y = 0;
            this.wheel            = {};
            this.wheel.delta      = 0;

            this.init_events();

            B.Tools.Mouse.prototype.instance = this;
        },

        /**
         * INIT EVENTS
         */
        init_events : function()
        {
            var that = this;

            // Down
            function mouse_down_handle( e )
            {
                that.down = true;

                if( that.trigger( 'down', [ that.position, e.target ] ) === false )
                {
                    console.log('prevented');
                    e.preventDefault();
                }
            }

            // Up
            function mouse_up_handle( e )
            {
                that.down = false;

                that.trigger( 'up', [ that.position, e.target ] );
            }

            // Move
            function mouse_move_handle( e )
            {
                that.position.x = e.clientX;
                that.position.y = e.clientY;

                that.position.ratio.x = that.position.x / that.browser.viewport.width;
                that.position.ratio.y = that.position.y / that.browser.viewport.height;

                that.trigger( 'move', [ that.position, e.target ] );
            }

            // Wheel
            function mouse_wheel_handle( e )
            {
                that.wheel.delta = e.wheelDeltaY || e.wheelDelta || - e.detail;

                if( that.trigger( 'wheel', [ that.wheel.delta ] ) === false )
                {
                    e.preventDefault();
                    return false;
                }
            }

            // Listen
            if (document.addEventListener)
            {
                document.addEventListener( 'mousedown', mouse_down_handle, false );
                document.addEventListener( 'mouseup', mouse_up_handle, false );
                document.addEventListener( 'mousemove', mouse_move_handle, false );
                document.addEventListener( 'mousewheel', mouse_wheel_handle, false );
                document.addEventListener( 'DOMMouseScroll', mouse_wheel_handle, false );
            }
            else
            {
                document.attachEvent( 'onmousedown', mouse_down_handle, false );
                document.attachEvent( 'onmouseup', mouse_up_handle, false );
                document.attachEvent( 'onmousemove', mouse_move_handle, false );
                document.attachEvent( 'onmousewheel', mouse_wheel_handle, false );
            }

        }
    } );
} )();

(function()
{
    'use strict';

    B.Tools.Keyboard = B.Core.Event_Emitter.extend(
    {
        options :
        {
            keycode_names :
            {
                91 : 'cmd',
                17 : 'ctrl',
                32 : 'space',
                16 : 'shift',
                18 : 'alt',
                20 : 'caps',
                9  : 'tab',
                13 : 'enter',
                8  : 'backspace',
                38 : 'up',
                39 : 'right',
                40 : 'down',
                37 : 'left',
                27 : 'esc'
            }
        },

        /**
         * STATIC INSTANTIATE (SINGLETON)
         */
        static_instantiate : function()
        {
            if( B.Tools.Keyboard.prototype.instance === null )
                return null;
            else
                return B.Tools.Keyboard.prototype.instance;
        },

        /**
         * INIT
         */
        init : function( options )
        {
            this._super( options );

            this.browser = new B.Tools.Browser();
            this.downs   = [];

            this.init_events();

            B.Tools.Keyboard.prototype.instance = this;
        },

        /**
         * INIT EVENTS
         */
        init_events : function()
        {
            var that = this;

            // Down
            window.onkeydown = function( e )
            {
                var character = that.keycode_to_character( e.keyCode );

                if( that.downs.indexOf( character ) === -1 )
                    that.downs.push( character );

                // Trigger and prevend default if asked by return false on callback
                if( that.trigger( 'down', [ e.keyCode, character ] ) === false )
                    e.preventDefault();
            };

            // Up
            window.onkeyup = function( e )
            {
                var character = that.keycode_to_character( e.keyCode );

                if( that.downs.indexOf( character ) !== -1 )
                    that.downs.splice( that.downs.indexOf( character ), 1 );

                that.trigger( 'up', [ e.keyCode, character ] );
            };
        },

        /**
         * KEYCODE TO CHAR
         */
        keycode_to_character : function( keycode )
        {
            var character = this.options.keycode_names[ keycode ];

            if( !character )
                character = String.fromCharCode( keycode ).toLowerCase();

            return character;
        },

        /**
         * ARE DOWN
         */
        are_down : function( keys )
        {
            var down = true;

            for( var i = 0; i < keys.length; i++ )
            {
                var key = keys[ i ];

                if( typeof key === 'number' )
                    key = this.keycode_to_character( key );

                if( this.downs.indexOf( key ) === -1 )
                    down = false;
            }

            return down;
        },

        /**
         * IS DOWN
         */
        is_down : function( key )
        {
            return this.are_down( [ key ] );
        }
    } );
} )();

(function()
{
    'use strict';

    B.Tools.Browser = B.Core.Event_Emitter.extend(
    {
        options:
        {
            disable_hover_on_scroll : true,
            initial_trigger : true,
            add_classes_to  :
            [
                'body'
            ],
            breakpoints :
            [
                {
                    name     : 'large',
                    limits   :
                    {
                        width :
                        {
                            value    : 960,
                            extreme  : 'min',
                            included : false
                        }
                    }
                },
                {
                    name     : 'medium',
                    limits   :
                    {
                        width :
                        {
                            value    : 960,
                            extreme  : 'max',
                            included : true
                        }
                    }
                },
                {
                    name     : 'small',
                    limits   :
                    {
                        width :
                        {
                            value    : 500,
                            extreme  : 'max',
                            included : true
                        }
                    }
                }
            ]
        },

        /**
         * STATIC INSTANTIATE (SINGLETON)
         */
        static_instantiate : function()
        {
            if( B.Tools.Browser.prototype.instance === null )
                return null;
            else
                return B.Tools.Browser.prototype.instance;
        },

        /**
         * INIT
         */
        init : function( options )
        {
            var that = this;

            this._super( options );

            this.ticker = new B.Tools.Ticker();

            this.viewport             = {};
            this.viewport.top         = 0;
            this.viewport.left        = 0;
            this.viewport.y           = 0;
            this.viewport.x           = 0;
            this.viewport.delta       = {};
            this.viewport.delta.top   = 0;
            this.viewport.delta.left  = 0;
            this.viewport.delta.y     = 0;
            this.viewport.delta.x     = 0;
            this.viewport.direction   = {};
            this.viewport.direction.x = null;
            this.viewport.direction.y = null;
            this.viewport.width       = window.innerWidth;
            this.viewport.height      = window.innerHeight;

            this.pixel_ratio   = window.devicePixelRatio || 1;
            this.shall_trigger = {};
            this.is            = null;
            this.version       = null;
            // this.mobile      = this.mobile_detection();

            this.init_browser_version();
            this.init_breakpoints();
            this.init_disable_hover_on_scroll();
            this.init_events();

            // Initial trigger
            if( this.options.initial_trigger )
            {
                // Do next frame
                this.ticker.do_next( function()
                {
                    // Trigger scroll and resize
                    that.scroll_handle();
                    that.resize_handle();
                } );
            }

            B.Tools.Browser.prototype.instance = this;
        },

        /**
         * INIT BREAKPOINTS
         */
        init_breakpoints : function()
        {
            this.breakpoints         = {};
            this.breakpoints.items   = [];
            this.breakpoints.current = null;

            this.add_breakpoints( this.options.breakpoints );
        },

        /**
         * ADD BREAKPOINTS
         */
        add_breakpoint : function( breakpoint )
        {
            this.breakpoints.items.push( breakpoint );
        },

        /**
         * ADD BREAKPOINTS
         */
        add_breakpoints : function( breakpoints )
        {
            for( var i = 0; i < breakpoints.length; i++ )
            {
                this.add_breakpoint( breakpoints[ i ] );
            }
        },

        /**
         * TEST BREAKPOINTS
         */
        test_breakpoints : function()
        {
            // Default to null
            var current_breakpoint = null;

            // Each breakpoint
            for( var i = 0, len = this.breakpoints.items.length; i < len; i++ )
            {
                var breakpoint = this.breakpoints.items[ i ],
                    width      = !breakpoint.limits.width,
                    height     = !breakpoint.limits.height;

                // Width must be tested
                if( !width )
                {

                    // Min
                    if( breakpoint.limits.width.extreme === 'min' )
                    {
                        if(
                            // Included
                            ( breakpoint.limits.width.included && this.viewport.width >= breakpoint.limits.width.value ) ||

                            // Not included
                            ( !breakpoint.limits.width.included && this.viewport.width > breakpoint.limits.width.value )
                        )
                            width = true;
                    }

                    // Max
                    else
                    {
                        if(
                            // Included
                            ( breakpoint.limits.width.included && this.viewport.width <= breakpoint.limits.width.value ) ||

                            // Not included
                            ( !breakpoint.limits.width.included && this.viewport.width < breakpoint.limits.width.value )
                        )
                            width = true;
                    }
                }

                // Height must be tested
                if( !height )
                {
                    // Min
                    if( breakpoint.limits.height.extreme === 'min' )
                    {
                        if(
                            // Included
                            ( breakpoint.limits.height.included && this.viewport.height >= breakpoint.limits.height.value ) ||

                            // Not included
                            ( !breakpoint.limits.height.included && this.viewport.height > breakpoint.limits.height.value )
                        )
                            height = true;
                    }

                    // Max
                    else
                    {
                        if(
                            // Included
                            ( breakpoint.limits.height.included && this.viewport.height <= breakpoint.limits.height.value ) ||

                            // Not included
                            ( !breakpoint.limits.height.included && this.viewport.height < breakpoint.limits.height.value )
                        )
                            height = true;
                    }
                }

                if( width && height )
                {
                    current_breakpoint = breakpoint;
                }
            }

            if( current_breakpoint !== this.breakpoints.current )
            {
                var old_breakpoint            = this.breakpoints.current;
                this.breakpoints.current      = current_breakpoint;
                this.shall_trigger.breakpoint = [ this.breakpoints.current, old_breakpoint ];
            }
        },

        /**
         * INIT DISABLE HOVER ON SCROLL
         * Huge gain in performance when scrolling
         */
        init_disable_hover_on_scroll : function()
        {
            if( !this.options.disable_hover_on_scroll )
                return;

            var that    = this,
                timeout = null,
                active  = false;

            function disable()
            {
                // Clear timeout if exist
                if( timeout )
                    window.clearTimeout( timeout );

                // Not active
                if( !active )
                {
                    // Activate
                    active = true;
                    document.body.style.pointerEvents = 'none';
                }

                timeout = window.setTimeout( function()
                {
                    // Deactivate
                    active = false;
                    document.body.style.pointerEvents = 'auto';
                }, 60 );
            }

            this.on( 'scroll', disable );
        },

        /**
         * INIT BROWSER VERSION
         */
        init_browser_version : function()
        {
            var is    = {},
                agent = navigator.userAgent.toLowerCase();

            // Detect browser
            is.opera             = !!window.opera || navigator.userAgent.indexOf( ' OPR/' ) >= 0;
            is.firefox           = typeof InstallTrigger !== 'undefined';
            is.safari            = Object.prototype.toString.call( window.HTMLElement ).indexOf( 'Constructor' ) > 0;
            is.chrome            = !!window.chrome && !is.opera;
            is.internet_explorer = ( ( agent.indexOf( 'msie' ) !== -1 ) && ( agent.indexOf( 'opera' ) === -1 ) );// For use within normal web clients
            is.ipad              = agent.indexOf( 'ipad' ) !== -1;

            // // For use within iPad developer UIWebView
            // // Thanks to Andrew Hedges!
            // var ua = navigator.userAgent;
            // var isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);

            // Alias
            is.O    = is.opera;
            is.FF   = is.firefox;
            is.SAF  = is.safari;
            is.CH   = is.chrome;
            is.IE   = is.internet_explorer;
            is.MSIE = is.internet_explorer;
            is.IPAD = is.ipad;

            this.is = is;

            this.version = false;

            if( this.is.IE )
            {
                var user_agent = navigator.userAgent.toLowerCase();
                this.version = user_agent.indexOf( 'msie' ) !== -1 ? parseInt( user_agent.split( 'msie' )[ 1 ], 10 ) : false;

                this.is[ 'internet_explorer_' + this.version ] = true;
                this.is[ 'IE_' + this.version ] = true;
            }

            // Add classes
            this.add_classes();
        },

        // /**
        //  * GET MOBILE
        //  */
        // mobile_detection : function()
        // {
        //     var checker = {};

        //     checker.iphone     = navigator.userAgent.match( /(iPhone|iPod|iPad)/ );
        //     checker.blackberry = navigator.userAgent.match( /BlackBerry/ );
        //     checker.android    = navigator.userAgent.match( /Android/ );
        //     checker.opera      = navigator.userAgent.match( /Opera Mini/i );
        //     checker.windows    = navigator.userAgent.match( /IEMobile/i );
        //     checker.all        = ( checker.iphone || checker.blackberry || checker.android || checker.opera || checker.windows );

        //     return checker;
        // },

        /**
         * ADD CLASSES
         * Add browser class to wanted elements like <body> or <html>
         */
        add_classes : function()
        {
            var targets = null;
            for( var i = 0, len = this.options.add_classes_to.length; i < len; i++ )
            {
                targets = document.querySelectorAll( this.options.add_classes_to[ i ] );

                if( targets.length )
                {
                    for( var key in this.is )
                    {
                        if( this.is[ key ] )
                        {
                            for( var j = 0; j < targets.length; j++ )
                            {
                                targets[ j ].classList.add( key );
                                if( this.is.IE && this.version )
                                {
                                    targets[ j ].classList.add( key + '-' + this.version );
                                }
                            }
                        }
                    }
                }
            }
        },

        /**
         * INIT EVENTS
         * Start listening events
         */
        init_events : function()
        {
            var that = this;

            // Ticker
            this.ticker.on( 'tick', function()
            {
                that.frame();
            } );

            // Resize
            window.onresize = function()
            {
                that.resize_handle();
            };

            // Scroll
            window.onscroll = function()
            {
                that.scroll_handle();
            };
        },

        /**
         * RESIZE HANDLE
         */
        resize_handle : function()
        {
            this.viewport.width  = window.innerWidth;
            this.viewport.height = window.innerHeight;

            this.test_breakpoints();

            this.shall_trigger.resize = [ this.viewport ];
        },

        /**
         * SCROLL HANDLE
         */
        scroll_handle : function()
        {
            // e = e || window.event;
            // if (e.preventDefault)
            //     e.preventDefault();
            // e.returnValue = false;

            var direction_y = null,
                direction_x = null,
                top         = null,
                left        = null;

            if( this.is.IE && document.compatMode === 'CSS1Compat' )
            {
                direction_y = window.document.documentElement.scrollTop  > this.viewport.top  ? 'down'  : 'up';
                direction_x = window.document.documentElement.scrollLeft > this.viewport.left ? 'right' : 'left';
                top         = window.document.documentElement.scrollTop;
                left        = window.document.documentElement.scrollLeft;
            }
            else
            {
                direction_y = window.pageYOffset > this.viewport.top  ? 'down'  : 'up';
                direction_x = window.pageXOffset > this.viewport.left ? 'right' : 'left';
                top         = window.pageYOffset;
                left        = window.pageXOffset;
            }

            this.viewport.direction.y = direction_y;
            this.viewport.direction.x = direction_x;
            this.viewport.delta.top   = top  - this.viewport.top;
            this.viewport.delta.left  = left - this.viewport.left;
            this.viewport.delta.y     = this.viewport.delta.top;
            this.viewport.delta.x     = this.viewport.delta.left;
            this.viewport.top         = top;
            this.viewport.left        = left;
            this.viewport.y           = this.viewport.top;
            this.viewport.x           = this.viewport.left;

            this.shall_trigger.scroll = [ this.viewport ];
        },

        /**
         * MATH MEDIA
         */
        match_media : function( condition )
        {
            if( !( 'matchMedia' in window ) || typeof condition !== 'string' || condition === '' )
                return false;

            return !!window.matchMedia( condition ).matches;
        },

        /**
         * FRAME
         */
        frame : function()
        {
            var keys = Object.keys( this.shall_trigger );


            for( var i = 0; i < keys.length; i++ )
                this.trigger( keys[ i ], this.shall_trigger[ keys[ i ] ] );

            if( keys.length )
                this.shall_trigger = {};
        }
    } );
} )();

(function()
{
    'use strict';

    B.Tools.Css = B.Core.Abstract.extend(
    {
        /**
         * STATIC INSTANTIATE (SINGLETON)
         */
        static_instantiate : function()
        {
            if( B.Tools.Css.prototype.instance === null )
                return null;
            else
                return B.Tools.Css.prototype.instance;
        },

        /**
         * INIT
         */
        init : function( options )
        {
            this._super( options );

            this.prefixes = [ 'webkit', 'moz', 'o', 'ms', '' ];
            this.browser  = new B.Tools.Browser();

            B.Tools.Css.prototype.instance = this;
        },

        /**
         * AppLY
         */
        apply : function( $target, property, value )
        {
            // Force array
            if( typeof $target.length === 'undefined' )
            {
                // console.log('ok');
                $target = [ $target ];
            }

            // Remove translateZ if necessary
            if( this.browser.is.IE && this.browser.version < 10 )
                value = value.replace( 'translateZ(0)', '' );

            // Add prefix
            for( var css = {}, i = 0, i_len = this.prefixes.length; i < i_len; i++ )
            {
                var updated_property = this.prefixes[ i ];

                if( updated_property !== '' )
                    updated_property += this.capitalize_first_letter( property );
                else
                    updated_property = property;

                css[ updated_property ] = value;
            }

            // Apply each CSS on each element
            var keys = Object.keys( css );
            for( var j = 0, j_len = $target.length; j < j_len; j++ )
            {
                var element = $target[ j ];

                for( var k = 0, k_len = keys.length; k < k_len; k++ )
                    element.style[ keys[ k ] ] = css[ keys[ k ] ];
            }
        },

        /**
         * CAPITALIZE FIRST LETTER
         */
        capitalize_first_letter : function( text )
        {
            return text.charAt( 0 ).toUpperCase() + text.slice( 1 );
        }
    } );
} )();

(function()
{
    'use strict';

    B.Tools.Images = B.Core.Abstract.extend(
    {
        /**
         * STATIC INSTANTIATE (SINGLETON)
         */
        static_instantiate : function()
        {
            if(B.Tools.Images.prototype.instance === null)
                return null;
            else
                return B.Tools.Images.prototype.instance;
        },

        /**
         * INIT
         * @param  object options
         * @return Images
         */
        init : function( options )
        {
            this._super( options );
            this.urls    = [];
            this.images  = [];
            this.length  = 0;
            this.loaded  = 0;

            B.Tools.Images.prototype.instance = this;
        },

        /**
         * LOAD URLS THEN CALL CALLBACK FUNCTION
         * @param  {[type]}   urls     [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        load : function(urls,callback)
        {
            var that  = this;

            if(typeof urls === 'string')
                this.urls.push(urls);
            else if(urls instanceof Array)
                this.urls = urls;

            this.images = [];
            this.length = this.urls.length;
            this.loaded = 0;

            for(var i = 0; i < this.length; i++)
            {
                (function()
                {
                    var image = new Image();
                    that.images.push(image);
                    image.onload = function()
                    {
                        that.loaded++;
                        if(that.loaded === that.length)
                            callback.call(that,that.images);
                    };
                    image.src = that.urls[i];
                })();
            }
        },

        /**
         * ADD IMAGE URL TO LOAD
         */
        add : function(urls)
        {
            if(typeof urls === 'string')
                this.urls.push(urls);
            else if(urls instanceof Array)
                this.urls = urls;
        },

        /**
         * GET COORDINATES AND SIZES
         * @param  object  parameters
         */
        get_proportions : function(parameters)
        {
            // Errors
            var errors = [];

            if(typeof parameters.image_width === 'undefined' || parseInt(parameters.image_width,10) === 0)
                errors.push('Image width must be specified');

            if(typeof parameters.image_height === 'undefined' || parseInt(parameters.image_height,10) === 0)
                errors.push('Image height must be specified');

            if(typeof parameters.container_width === 'undefined' || parseInt(parameters.container_width,10) === 0)
                errors.push('Container width must be specified');

            if(typeof parameters.container_height === 'undefined' || parseInt(parameters.container_height,10) === 0)
                errors.push('Container height must be specified');

            if(errors.length)
            {
                // for(var i = 0, len = errors.length; i < len; i++)
                //     console.warn(errors[i]);

                return false;
            }

            // Defaults
            parameters.fit_type    = parameters.fit_type    || 'fill';
            parameters.alignment_x = parameters.alignment_x || 'center';
            parameters.alignment_y = parameters.alignment_y || 'middle';
            parameters.rounding    = parameters.rounding    || 'ceil';
            parameters.coordinates = parameters.coordinates || 'css';

            var proportions  = {},
                image_ratio  = parameters.image_width / parameters.image_height,
                canvas_ratio = parameters.container_width / parameters.container_height,
                width        = 0,
                height       = 0,
                x            = 0,
                y            = 0,
                fit_in       = null;

            // Reformats
            parameters.fit_type    = parameters.fit_type.toLowerCase();
            parameters.alignment_x = parameters.alignment_x.toLowerCase();
            parameters.alignment_y = parameters.alignment_y.toLowerCase();
            parameters.rounding    = parameters.rounding.toLowerCase();
            parameters.coordinates = parameters.coordinates.toLowerCase();

            // Alignment
            if(typeof parameters.alignment_x === undefined || (parameters.alignment_x !== 'left' && parameters.alignment_x !== 'center' && parameters.alignment_x !== 'right'))
                parameters.alignment_x = 'center';
            if(typeof parameters.alignment_y === undefined || (parameters.alignment_y !== 'top' && parameters.alignment_y !== 'middle' && parameters.alignment_y !== 'bottom'))
                parameters.alignment_y = 'middle';

            // Functions
            var set_full_width = function()
            {
                width  = parameters.container_width;
                height = (parameters.container_width / parameters.image_width) * parameters.image_height;
                x      = 0;
                fit_in = 'width';

                switch(parameters.alignment_y)
                {
                    case 'top':
                        y = 0;
                        break;
                    case 'middle':
                        y = (parameters.container_height - height) / 2;
                        break;
                    case 'bottom':
                        y = parameters.container_height - height;
                        break;
                }
            };
            var set_full_height = function()
            {
                height = parameters.container_height;
                width  = (parameters.container_height / parameters.image_height) * parameters.image_width;
                y      = 0;
                fit_in = 'height';

                switch(parameters.alignment_x)
                {
                    case 'left':
                        x = 0;
                        break;
                    case 'center':
                        x = (parameters.container_width - width) / 2;
                        break;
                    case 'right':
                        x = parameters.container_width - width;
                        break;
                }
            };

            // Image must fill the container
            if(parameters.fit_type === 'fill' || parameters.fit_type === 'full')
            {
                if(image_ratio < canvas_ratio)
                    set_full_width();
                else
                    set_full_height();
            }

            else if(parameters.fit_type === 'fit' || parameters.fit_type === 'i sits')
            {
                if(image_ratio < canvas_ratio)
                    set_full_height();
                else
                    set_full_width();
            }

            // Rounding
            if(parameters.rounding === 'ceil' || parameters.rounding === 'round' || parameters.rounding === 'floor')
            {
                width  = Math[parameters.rounding].call(this,width);
                height = Math[parameters.rounding].call(this,height);
                x      = Math[parameters.rounding].call(this,x);
                y      = Math[parameters.rounding].call(this,y);
            }

            // Coordinates
            if(parameters.coordinates === 'cartesian')
            {
                proportions.width  = width;
                proportions.height = height;
                proportions.x      = x;
                proportions.y      = y;
            }
            else
            {
                proportions.width  = width;
                proportions.height = height;
                proportions.left   = x;
                proportions.top    = y;
            }

            // Fit in
            proportions.fit_in = fit_in;

            return proportions;
        }
    });
})();

(function()
{
    'use strict';

    B.Tools.Ticker = B.Core.Event_Emitter.extend(
    {
        options :
        {
            auto_run : true
        },

        /**
         * STATIC INSTANTIATE (SINGLETON)
         */
        static_instantiate : function()
        {
            if( B.Tools.Ticker.prototype.instance === null )
                return null;
            else
                return B.Tools.Ticker.prototype.instance;
        },

        /**
         * INIT
         */
        init : function( options )
        {
            this._super( options );

            this.started                = false;
            this.running                = false;
            this.time                   = {};
            this.time.start             = 0;
            this.time.elapsed           = 0;
            this.time.delta             = 0;
            this.time.current           = 0;
            this.do_next_actions        = {};
            this.do_next_actions.before = [];
            this.do_next_actions.after  = [];

            if( this.options.auto_run )
                this.run();

            B.Tools.Ticker.prototype.instance = this;
        },

        /**
         * START
         */
        start : function( run )
        {
            this.started = true;

            this.time.start   = + ( new Date() );
            this.time.current = this.time.start;
            this.time.elapsed = 0;
            this.time.delta   = 0;

            if( run )
                this.run();
        },

        /**
         * RUN
         */
        run : function()
        {
            var that = this;

            // Already running
            if( this.running )
                return;

            this.running = true;

            var loop = function()
            {
                if(that.running)
                    window.requestAnimationFrame( loop );

                that.tick();
            };

            loop();
        },

        /**
         * STOP
         */
        stop : function()
        {
            this.running = false;
        },

        /**
         * TICK
         */
        tick : function()
        {
            if( !this.started )
                this.start();

            // Set time infos
            this.time.current = + ( new Date() );
            this.time.delta   = this.time.current - this.time.start - this.time.elapsed;
            this.time.elapsed = this.time.current - this.time.start;

            var i   = 0,
                len = this.do_next_actions.before.length;

            // Do next (before trigger)
            for( ; i < len; i++ )
            {
                this.do_next_actions.before[ i ].call( this, [ this.time ] );
                this.do_next_actions.before.splice( i, 1 );
            }

            // Trigger
            this.trigger( 'tick', [ this.time ] );

            // Do next (after trigger)
            i   = 0;
            len = this.do_next_actions.after.length;
            for( ; i < len; i++ )
            {
                this.do_next_actions.after[ i ].call( this, [ this.time ] );
                this.do_next_actions.after.splice( i, 1 );
            }
        },

        /**
         * DO NEXT
         */
        do_next : function( action, before )
        {
            if( typeof action !== 'function' )
                return false;

            this.do_next_actions[ before ? 'before' : 'after' ].push( action );
        }
    });
})();
