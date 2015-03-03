/**
 * @class    Css
 * @author   Bruno SIMON / http://bruno-simon.com
 */
( function()
{
    'use strict';

    B.Tools.Css = B.Core.Abstract.extend(
    {
        static  : 'css',
        options :
        {
            prefixes : [ 'webkit', 'moz', 'o', 'ms', '' ]
        },

        /**
         * Apply css on target and add every prefixes
         * @param  {HTMLElement} target HTML element that need to be applied
         * @param  {string} property Property name
         * @param  {string} value    Value
         * @return {HTMLElement}     Modified element
         */
        apply : function( target, property, value )
        {
            // Force array
            if( typeof target.length === 'undefined' )
            {
                target = [ target ];
            }

            // // Remove translateZ if necessary
            // if( this.browser.is.IE && this.browser.version < 10 )
            //     value = value.replace( 'translateZ(0)', '' );

            // Add prefix
            for( var css = {}, i = 0, i_len = this.options.prefixes.length; i < i_len; i++ )
            {
                var updated_property = this.options.prefixes[ i ];

                if( updated_property !== '' )
                    updated_property += this.capitalize_first_letter( property );
                else
                    updated_property = property;

                css[ updated_property ] = value;
            }

            // Apply each CSS on each element
            var keys = Object.keys( css );
            for( var j = 0, j_len = target.length; j < j_len; j++ )
            {
                var element = target[ j ];

                for( var k = 0, k_len = keys.length; k < k_len; k++ )
                    element.style[ keys[ k ] ] = css[ keys[ k ] ];
            }

            return target;
        },

        /**
         * Capitalize first letter
         * @param  {string} input Input
         * @return {string}       Output
         */
        capitalize_first_letter : function( input )
        {
            return input.charAt( 0 ).toUpperCase() + input.slice( 1 );
        }
    } );
} )();
