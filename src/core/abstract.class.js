/**
 * @class  Resizer
 * @author Bruno SIMON / http://bruno-simon.com
 */
(function()
{
    'use strict';

    B.Core.Abstract = B.Class.extend(
    {
        register : false,
        static   : false,

        /**
         * Initialise and merge options
         * @constructor
         * @param {object} options Properties to merge with defaults
         */
        construct : function( options )
        {
            if( typeof options === 'undefined' )
                options = {};

            B.merge( this.options, options );

            this.$ = {};

            // Create statics container
            if( typeof B.Statics !== 'object' )
                B.Statics = {};

            // Register
            if( this.register && typeof this.register === 'string' )
            {
                var registry = new B.Tools.Registry();
                registry.set( this.register, this );
            }

            // Static
            if( this.static && typeof this.static === 'string' )
            {
                // Add instance to statics
                B.Statics[ this.static ] = this;
            }
        },

        /**
         * True constructur used first to return class if static
         * @return {class|null} Return class if static or null if default
         */
        static_instantiate : function()
        {
            if( B.Statics && B.Statics[ this.static ] )
                return B.Statics[ this.static ];
            else
                return null;
        },

        /**
         * Destroy
         */
        destroy : function()
        {

        }
    } );
} )();
