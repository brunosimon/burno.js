(function()
{
    'use strict';

    B.Tools.Registry = B.Core.Abstract.extend(
    {
        static  : 'registry',
        /**
         * INIT
         */
        init : function( options )
        {
            this._super( options );

            this.items = {};
        },

        /**
         * GET
         */
        get : function( key )
        {
            if( this.items[ key ] )
                return this.items[ key ];

            return false;
        },

        /**
         * SET
         */
        set : function( key, value )
        {
            this.items[ key ] = value;

            return value;
        }
    } );
} )();
