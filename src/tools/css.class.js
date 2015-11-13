/**
 * @class    Css
 * @author   Bruno SIMON / http://bruno-simon.com
 * @requires B.Tools.Detector
 */
B.Tools.Css = B.Core.Abstract.extend(
{
    static  : 'css',
    options :
    {
        prefixes : [ 'webkit', 'moz', 'o', 'ms', '' ]
    },

    /**
     * Initialise and merge options
     * @constructor
     * @param {object} options Properties to merge with defaults
     */
    construct : function( options )
    {
        this._super( options );

        this.detector = new B.Tools.Detector();
        this.strings  = new B.Tools.Strings();
    },

    /**
     * Apply css on target and add every prefixes
     * @param  {HTMLElement} target   HTML element that need to be applied
     * @param  {object}      style    CSS style
     * @param  {array}       prefixes Array of prefixes (default from options)
     * @param  {boolean}     clean    Should clean the style
     * @return {HTMLElement}     Modified element
     */
    apply : function( target, style, prefixes, clean )
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

        // Clean
        if( typeof clean === 'undefined' || clean )
            style = this.clean_style( style );

        // Add prefix
        if( prefixes instanceof Array )
        {
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
                {
                    element.style[ _property ] = style[ _property ];
                }
            }
        }

        return target;
    },

    /**
     * Clean style
     * @param  {object} value Style to clean
     * @return {object}       Cleaned style
     */
    clean_style : function( style )
    {
        var new_style = {};

        // Each property
        for( var property in style )
        {
            var value = style[ property ];

            // Clean property and value
            new_style[ this.clean_property( property ) ] = this.clean_value( value );
        }

        return new_style;
    },

    /**
     * Clean property by removing prefixes and converting to camelCase
     * @param {string} value Property to clean
     */
    clean_property : function( value )
    {
        // Remove prefixes
        value = value.replace( /(webkit|moz|o|ms)?/i, '' );
        value = this.strings.convert_case( value, 'camel' );

        return value;
    },

    /**
     * Clean value
     * @param {string} value Property to fix
     */
    clean_value : function( value )
    {
        // IE 9
        if( this.detector.browser.ie === 9 )
        {
            // Remove translateZ
            if( /translateZ/.test( value ) )
                value = value.replace( /translateZ\([^)]*\)/g, '' );

            // Replace translate3d by translateX and translateY
            if( /   /.test( value ) )
                value = value.replace( /translate3d\(([^,]*),([^,]*),([^)])*\)/g, 'translateX($1) translateY($2)' );
        }

        return value;
    }
} );
