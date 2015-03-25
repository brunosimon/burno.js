/**
 * @class    Strings
 * @author   Bruno SIMON / http://bruno-simon.com
 */
( function()
{
    'use strict';

    B.Tools.Strings = B.Core.Abstract.extend(
    {
        static  : 'strings',
        options : {},
        formats :
        {
            camel      : [ 'camel', 'camelback', 'compoundnames' ],
            pascal     : [ 'pascal', 'uppercamelcase', 'bumpycaps', 'camelcaps', 'capitalizedwords', 'capwords' ],
            snake      : [ 'snake', 'underscore' ],
            dash       : [ 'dash', 'dashed', 'hyphen', 'kebab', 'spinal' ],
            train      : [ 'train' ],
            space      : [ 'space' ],
            title      : [ 'title' ],
            dot        : [ 'dot' ],
            slash      : [ 'slash', 'forwardslash', 'path' ],
            backslash  : [ 'backslash', 'hack', 'whack', 'escape', 'reverseslash', 'slosh', 'backslant', 'downhill', 'backwhack' ],
            lower      : [ 'lower' ],
            upper      : [ 'upper' ],
            studlycaps : [ 'studlycaps' ],
            burno      : [ 'burno', 'lol', 'yolo' ],
        },

        /**
         * Convert a value to any case listed above
         * Return base value if case not found
         * @param  {string} value  Any string value
         * @param  {string} format Any case listed above (allow 'case' at the end and other chars than letters like camEl-CasE)
         * @return {string}        Covnerted value
         */
        convert : function( value, format )
        {
            // Clean value
            value = value.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' ); // Trim (no polyfill needed)

            // Clean format
            format = format.toLowerCase();               // To lower
            format = format.replace( /[^[a-z]]*/g, '' ); // normalize
            format = format.replace( /case/g, '' );      // Remove 'case'

            // Find format
            var true_format = null;
            for( var original_name in this.formats )
            {
                for( var synonym_name_key in this.formats[ original_name ] )
                {
                    var synonym_name = this.formats[ original_name ][ synonym_name_key ];

                    if( synonym_name === format )
                        true_format = synonym_name;
                }
            }

            // Format not found
            if( !true_format )
                return value;

            // Convert case variation to dashes
            value = value.replace( /([a-z])([A-Z])/g, "$1-$2" );
            value = value.toLowerCase();

            // Get parts
            var parts = value.split( /[-_ .\/\\]/g );

            // Convert
            var new_value = null,
                i         = null,
                len       = null;

            switch( true_format )
            {
                case 'camel' :
                    for( i = 0, len = parts.length; i < len; i++ )
                    {
                        if( i !== 0 )
                            parts[ i ] = parts[ i ].charAt( 0 ).toUpperCase() + parts[ i ].slice( 1 );
                    }
                    new_value = parts.join( '' );
                    break;
                case 'pascal' :
                    for( i = 0, len = parts.length; i < len; i++ )
                        parts[ i ] = parts[ i ].charAt( 0 ).toUpperCase() + parts[ i ].slice( 1 );
                    new_value = parts.join( '' );
                    break;
                case 'snake' :
                    new_value = parts.join( '_' );
                    break;
                case 'dash' :
                    new_value = parts.join( '-' );
                    break;
                case 'train' :
                    for( i = 0, len = parts.length; i < len; i++ )
                        parts[ i ] = parts[ i ].charAt( 0 ).toUpperCase() + parts[ i ].slice( 1 );
                    new_value = parts.join( '-' );
                    break;
                case 'space' :
                    new_value = parts.join( ' ' );
                    break;
                case 'title' :
                    for( i = 0, len = parts.length; i < len; i++ )
                        parts[ i ] = parts[ i ].charAt( 0 ).toUpperCase() + parts[ i ].slice( 1 );
                    new_value = parts.join( ' ' );
                    break;
                case 'dot' :
                    new_value = parts.join( '.' );
                    break;
                case 'slash' :
                    new_value = parts.join( '/' );
                    break;
                case 'backslash' :
                    new_value = parts.join( '\\' );
                    break;
                case 'lower' :
                    new_value = parts.join( '' );
                    break;
                case 'upper' :
                    new_value = parts.join( '' );
                    new_value = new_value.toUpperCase();
                    break;
                case 'studlycaps' :
                    new_value = parts.join( '' );
                    for( i = 0, len = new_value.length; i < len; i++ )
                    {
                        if( Math.random() > 0.5 )
                            new_value = new_value.substr( 0, i ) + new_value[ i ].toUpperCase() + new_value.substr( i + 1 );
                    }
                    break;
                case 'burno' :
                    for( i = 0, len = parts.length; i < len; i++ )
                        parts[ i ] = 'burno';
                    new_value = parts.join( ' ' );
                    break;
            }

            return new_value;
        }
    } );
} )();
