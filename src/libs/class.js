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
              if(typeof (ext) !== 'object' || (typeof HTMLElement !== 'undefined' && ext instanceof HTMLElement) || ext instanceof Class || (typeof THREE !== 'undefined' && ext instanceof THREE.Object3D) || (typeof ext !== 'undefined' && ( typeof jQuery !== 'undefined' && ext instanceof jQuery)))
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
