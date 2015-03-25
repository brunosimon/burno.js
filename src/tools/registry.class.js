/**
 * @class    Registry
 * @author   Bruno SIMON / http://bruno-simon.com
 */
( function()
{
    'use strict';

    B.Tools.Registry = B.Core.Abstract.extend(
    {
        static  : 'registry',
        options : {},

        /**
         * Initialise and merge options
         * @constructor
         * @param {object} options Properties to merge with defaults
         */
        construct : function( options )
        {
            this._super( options );

            this.items = {};
        },

        /**
         * Try to retrieve stored value for specified key
         * @param  {string} key Key for the value
         * @return {any}        Stored value (undefined if not found)
         */
        get : function( key, callback )
        {
            // Found
            if( typeof this.items[ key ] !== 'undefined' )
                return this.items[ key ];

            // Not found but callback provided
            if( typeof callback === 'function' )
                return callback.apply( this );

            // Otherwise
            return undefined;
        },

        /**
         * Set value width specified key (will override previous value)
         * @param {string} key   Key for the value
         * @param {any}    value Anything to store
         */
        set : function( key, value )
        {
            this.items[ key ] = value;

            return value;
        }
    } );
} )();
