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
        apply : function( target, style, prefixes )
        {
            // jQuery handling
            if( typeof jQuery !== 'undefined' && target instanceof jQuery)
                target = target.toArray();

            // Force array
            if( typeof target.length === 'undefined' )
                target = [ target ];

            // Prefixes
            if( typeof prefixes === 'undefined' )
                prefixes = false;

            if( prefixes === true )
                prefixes = this.options.prefixes;

            if( prefixes instanceof Array )
            {
                // Add prefix
                var new_style = {};
                for( var property in style )
                {
                    for( var prefix in prefixes )
                    {
                        var new_property = null;

                        if( prefixes[ prefix ] )
                            new_property = prefixes[ prefix ] + ( property.charAt( 0 ).toUpperCase() + property.slice( 1 ) );
                        else
                            new_property = property;

                        new_style[ new_property ] = style[ property ];
                    }
                }

                style = new_style;
            }

            // Apply style on each element
            for( var element in target )
            {
                element = target[ element ];

                if( element instanceof HTMLElement )
                {
                    for( var _property in style )
                        element.style[ _property ] = style[ _property ];
                }

            }

            return target;
        }
    } );
} )();
