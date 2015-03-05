/**
 * @class  Resizer
 * @author Bruno SIMON / http://bruno-simon.com
 */
(function()
{
    'use strict';

    B.Core.Abstract = B.Class.extend(
    {
        static : false,

        /**
         * Initialise and merge options
         * @constructor
         * @param {object} options Properties to merge with defaults
         */
        init : function( options )
        {
            if( typeof options === 'undefined' )
                options = {};

            B.merge( this.options, options );

            // Create statics container
            if( typeof B.Statics !== 'object' )
                B.Statics = {};

            // Static
            if( this.static )
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
