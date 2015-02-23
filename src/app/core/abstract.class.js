(function()
{
    'use strict';

    B.Core.Abstract = Class.extend(
    {
        static : false,

        /**
         * INIT
         */
        init : function( options )
        {
            if( typeof options === 'undefined' )
                options = {};

            this.$ = {};

            this.options = merge( this.options,options );

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
         * STATIC INSTANTIATE (SINGLETON)
         */
        static_instantiate : function()
        {
            if( B.Statics && B.Statics[ this.static ] )
                return B.Statics[ this.static ];
            else
                return null;
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
