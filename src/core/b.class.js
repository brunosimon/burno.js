// Simple structure
var B =
{
    Core       : {},
    Tools      : {},
    Components : {}
};

/**
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/blog/simple-javascript-inheritance/
 * MIT Licensed.
 * Inspired by base2 and Prototype
 */
( function()
{
    'use strict';

    B.copy = function( object )
    {
        var c = null;

        // Simple object (exclude jQuery object, HTML Element, THREE js, ...)
        if(
            typeof object === 'undefined' ||
            object.constructor === Object
        )
        {
            c = {};

            for( var key in object )
                c[ key ] = B.copy( object[ key ] );

            return c;
        }

        // Array
        else if( object instanceof Array )
        {
            c = [];

            for( var i = 0, l = object.length; i < l; i++ )
                c[ i ] = B.copy( object[ i ] );

            return c;
        }

        // Other
        else
        {
            return object;
        }
    };

    B.merge = function( original, extended )
    {
        for( var key in extended )
        {
            var ext = extended[ key ];

            if( ext.constructor === Object )
            {
                if( !original[ key ] )
                    original[ key ] = {};

                // ext = Object.create( ext );

                original[ key ] = B.merge( original[ key ], ext );
            }
            else
            {
                original[ key ] = ext;
            }
        }

        return original;
    };

    var initializing = false,
        fnTest       = /xyz/.test( function()
        {
            xyz;
        } ) ? /\b_super\b/ : /.*/;

    B.Class = function(){};

    var inject = function( prop )
    {
        var proto  = this.prototype,
            _super = {};

        for( var name in prop )
        {
            if( typeof prop[ name ] === 'function' && typeof proto[ name ] === 'function' && fnTest.test( prop[ name ] ) )
            {
                _super[ name ] = proto[ name ];
                proto[ name ]  = ( function( name, fn )
                {
                    return function()
                    {
                        var tmp     = this._super;
                        this._super = _super[ name ];
                        var ret     = fn.apply( this, arguments );
                        this._super = tmp;
                        return ret;
                    };
                } )( name, prop[ name ] );
            }

            else
            {
                proto[ name ] = prop[ name ];
            }
        }
    };

    B.Class.extend = function( prop )
    {
        var _super    = this.prototype;
        initializing  = true;
        var prototype = new this();
        initializing  = false;

        for( var name in prop )
        {
            if( typeof prop[ name ] === 'function' && typeof _super[ name ] === 'function' && fnTest.test( prop[ name ] ) )
            {
                prototype[ name ] = ( function( name, fn )
                {
                    return function()
                    {
                        var tmp     = this._super;
                        this._super = _super[ name ];
                        var ret     = fn.apply( this, arguments );
                        this._super = tmp;

                        return ret;
                    };
                } )( name, prop[ name ] );
            }
            else
            {
                if( name === 'options' )
                {
                    if( typeof prototype[ name ] === 'undefined' )
                        prototype[ name ] = {};

                    var prototype_copy = B.copy( prototype[ name ] ),
                        prop_copy      = B.copy( prop[ name ] );

                    prototype[ name ] = B.merge( prototype_copy, prop_copy );
                }
                else
                {
                    prototype[ name ] = prop[ name ];
                }
            }
        }

        function Class()
        {
            if( !initializing )
            {
                if( this.static_instantiate )
                {
                    var obj = this.static_instantiate.apply( this, arguments );
                    if( obj )
                        return obj;
                }

                for( var p in this )
                {
                    if( typeof this[ p ] === 'object' )
                    {
                        this[ p ] = B.copy( this[ p ] );
                    }
                }

                if( this.init )
                {
                    this.init.apply( this, arguments );
                }
            }
            return this;
        }

        Class.prototype             = prototype;
        Class.prototype.constructor = Class;
        Class.extend                = B.Class.extend;
        Class.inject                = inject;

        return Class;
    };
} )();
