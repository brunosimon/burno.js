/**
 * @class    Colors
 * @author   Bruno SIMON / http://bruno-simon.com
 */
( function()
{
    'use strict';

    B.Tools.Colors = B.Core.Abstract.extend(
    {
        static  : 'colors',
        options :
        {
            gradients :
            {
                parse   : true,
                target  : document.body,
                classes :
                {
                    to_convert : 'gradient-text',
                    converted  : 'gradient-text-converted',
                }
            }
        },
        names   :
        {
            'aliceblue'            : 'F0F8FF',
            'antiquewhite'         : 'FAEBD7',
            'aqua'                 : '00FFFF',
            'aquamarine'           : '7FFFD4',
            'azure'                : 'F0FFFF',
            'beige'                : 'F5F5DC',
            'bisque'               : 'FFE4C4',
            'black'                : '000000',
            'blanchedalmond'       : 'FFEBCD',
            'blue'                 : '0000FF',
            'blueviolet'           : '8A2BE2',
            'brown'                : 'A52A2A',
            'burlywood'            : 'DEB887',
            'cadetblue'            : '5F9EA0',
            'chartreuse'           : '7FFF00',
            'chocolate'            : 'D2691E',
            'coral'                : 'FF7F50',
            'cornflowerblue'       : '6495ED',
            'cornsilk'             : 'FFF8DC',
            'crimson'              : 'DC143C',
            'cyan'                 : '00FFFF',
            'darkblue'             : '00008B',
            'darkcyan'             : '008B8B',
            'darkgoldenrod'        : 'B8860B',
            'darkgray'             : 'A9A9A9',
            'darkgreen'            : '006400',
            'darkkhaki'            : 'BDB76B',
            'darkmagenta'          : '8B008B',
            'darkolivegreen'       : '556B2F',
            'darkorange'           : 'FF8C00',
            'darkorchid'           : '9932CC',
            'darkred'              : '8B0000',
            'darksalmon'           : 'E9967A',
            'darkseagreen'         : '8FBC8F',
            'darkslateblue'        : '483D8B',
            'darkslategray'        : '2F4F4F',
            'darkturquoise'        : '00CED1',
            'darkviolet'           : '9400D3',
            'deeppink'             : 'FF1493',
            'deepskyblue'          : '00BFFF',
            'dimgray'              : '696969',
            'dodgerblue'           : '1E90FF',
            'firebrick'            : 'B22222',
            'floralwhite'          : 'FFFAF0',
            'forestgreen'          : '228B22',
            'fuchsia'              : 'FF00FF',
            'gainsboro'            : 'DCDCDC',
            'ghostwhite'           : 'F8F8FF',
            'gold'                 : 'FFD700',
            'goldenrod'            : 'DAA520',
            'gray'                 : '808080',
            'green'                : '008000',
            'greenyellow'          : 'ADFF2F',
            'honeydew'             : 'F0FFF0',
            'hotpink'              : 'FF69B4',
            'indianred'            : 'CD5C5C',
            'indigo'               : '4B0082',
            'ivory'                : 'FFFFF0',
            'khaki'                : 'F0E68C',
            'lavender'             : 'E6E6FA',
            'lavenderblush'        : 'FFF0F5',
            'lawngreen'            : '7CFC00',
            'lemonchiffon'         : 'FFFACD',
            'lightblue'            : 'ADD8E6',
            'lightcoral'           : 'F08080',
            'lightcyan'            : 'E0FFFF',
            'lightgoldenrodyellow' : 'FAFAD2',
            'lightgray'            : 'D3D3D3',
            'lightgreen'           : '90EE90',
            'lightpink'            : 'FFB6C1',
            'lightsalmon'          : 'FFA07A',
            'lightseagreen'        : '20B2AA',
            'lightskyblue'         : '87CEFA',
            'lightslategray'       : '778899',
            'lightsteelblue'       : 'B0C4DE',
            'lightyellow'          : 'FFFFE0',
            'lime'                 : '00FF00',
            'limegreen'            : '32CD32',
            'linen'                : 'FAF0E6',
            'magenta'              : 'FF00FF',
            'maroon'               : '800000',
            'mediumaquamarine'     : '66CDAA',
            'mediumblue'           : '0000CD',
            'mediumorchid'         : 'BA55D3',
            'mediumpurple'         : '9370DB',
            'mediumseagreen'       : '3CB371',
            'mediumslateblue'      : '7B68EE',
            'mediumspringgreen'    : '00FA9A',
            'mediumturquoise'      : '48D1CC',
            'mediumvioletred'      : 'C71585',
            'midnightblue'         : '191970',
            'mintcream'            : 'F5FFFA',
            'mistyrose'            : 'FFE4E1',
            'moccasin'             : 'FFE4B5',
            'navajowhite'          : 'FFDEAD',
            'navy'                 : '000080',
            'oldlace'              : 'FDF5E6',
            'olive'                : '808000',
            'olivedrab'            : '6B8E23',
            'orange'               : 'FFA500',
            'orangered'            : 'FF4500',
            'orchid'               : 'DA70D6',
            'palegoldenrod'        : 'EEE8AA',
            'palegreen'            : '#98FB98',
            'paleturquoise'        : '#AFEEEE',
            'palevioletred'        : '#DB7093',
            'papayawhip'           : '#FFEFD5',
            'peachpuff'            : '#FFDAB9',
            'peru'                 : '#CD853F',
            'pink'                 : '#FFC0CB',
            'plum'                 : '#DDA0DD',
            'powderblue'           : '#B0E0E6',
            'purple'               : '#800080',
            'rebeccapurple'        : '#663399',
            'red'                  : '#FF0000',
            'rosybrown'            : '#BC8F8F',
            'royalblue'            : '#4169E1',
            'saddlebrown'          : '#8B4513',
            'salmon'               : '#FA8072',
            'sandybrown'           : '#F4A460',
            'seagreen'             : '#2E8B57',
            'seashell'             : '#FFF5EE',
            'sienna'               : '#A0522D',
            'silver'               : '#C0C0C0',
            'skyblue'              : '#87CEEB',
            'slateblue'            : '#6A5ACD',
            'slategray'            : '#708090',
            'snow'                 : '#FFFAFA',
            'springgreen'          : '#00FF7F',
            'steelblue'            : '#4682B4',
            'tan'                  : '#D2B48C',
            'teal'                 : '#008080',
            'thistle'              : '#D8BFD8',
            'tomato'               : '#FF6347',
            'turquoise'            : '#40E0D0',
            'violet'               : '#EE82EE',
            'wheat'                : '#F5DEB3',
            'white'                : '#FFFFFF',
            'whitesmoke'           : '#F5F5F5',
            'yellow'               : '#FFFF00',
            'yellowgreen'          : '#9ACD32'
        },

        /**
         * Initialise and merge options
         * @constructor
         * @param {object} options Properties to merge with defaults
         */
        init : function( options )
        {
            this._super( options );

            if( this.options.gradients.parse )
                this.parse();
        },

        /**
         * Try to convert any data to RGB object
         * @param  {any}     Any color format
         * @return {object}  RGB object
         */
        any_to_rgb : function( input )
        {
            input = '' + input;            // String
            input = input.toLowerCase();   // Lower case
            input = input.replace(/[\s-]/g,''); // No spaces

            // Name
            if( typeof this.names[ input ] !== 'undefined' )
            {
                return this.hexa_to_rgb( this.names[ input ] );
            }

            // '0x' Hexa type
            if( input.indexOf( '0x' ) === 0 )
            {
                return this.hexa_to_rgb( input.replace( '0x', '' ) );
            }

            // '#' Hexa type
            if( input.indexOf( '#' ) === 0 )
            {
                input = input.replace( '#', '' );
            }

            // XXXXXX hexa type
            if( input.length === 6 )
            {
                return this.hexa_to_rgb( input );
            }

            // XXX hexa type
            if( input.length === 3 )
            {
                var new_input = '';
                for( var i = 0; i < input.length; i++ )
                    new_input += input[ i ] + input[ i ];

                return this.hexa_to_rgb( new_input );
            }

            // Objects
            try
            {
                input  = JSON.parse( input );

                if( typeof input.r !== 'undefined' && typeof input.g !== 'undefined' && typeof input.b !== 'undefined' )
                {
                    return input;
                }
                else if( typeof input.h !== 'undefined' && typeof input.s !== 'undefined' && typeof input.l !== 'undefined' )
                {
                    return this.hsl_to_rgb( input );
                }
            }
            catch( e ){}

            // No type found
            console.warn( 'Wrong color value : ' + input );

            return { r : 0, g : 0, b : 0 };
        },

        /**
         * Parse the target looking for text to convert to gradients
         * @param  {HTMLElement} target   HTML target (default body)
         * @param  {string}      selector Query selector
         * @return {object}               Context
         */
        parse : function( target, selector )
        {
            // Defaults
            target   = target   || this.options.gradients.target;
            selector = selector || this.options.gradients.classes.to_convert;

            var that     = this,
                elements = target.querySelectorAll( '.' + selector );

            // Each element
            for( var i = 0, i_len = elements.length; i < i_len; i++ )
            {
                var element    = elements[ i ];

                if( !element.classList.contains( this.options.gradients.classes.converted ) )
                {
                    var beautified = '',
                        text       = element.innerText,
                        start      = element.getAttribute( 'data-gradient-start' ),
                        end        = element.getAttribute( 'data-gradient-end' ),
                        steps      = null;

                    if( !start )
                        start = '#47add9';

                    if( !end )
                        end = '#3554e9';

                    steps = that.get_steps_colors( start, end, text.length, 'rgb' );

                    for( var j = 0, j_len = text.length; j < j_len; j++ )
                    {
                        beautified += '<span style="color:rgb(' + steps[ j ].r + ',' + steps[ j ].g + ',' + steps[ j ].b + ')">' + text[ j ] + '</span>';
                    }

                    element.innerHTML = beautified;
                }
            }


            // $texts.each( function()
            // {
            //     var $text    = $( this ),
            //         new_text = '',
            //         text     = $text.text(),
            //         start    = $text.data( 'gradient-start' ),
            //         end      = $text.data( 'gradient-end' ),
            //         steps    = null;

            //     if( !start )
            //         start = '#47add9';

            //     if( !end )
            //         end = '#3554e9';

            //     steps = that.get_steps_colors( start, end, text.length, 'rgb' );

            //     for( var i = 0; i < text.length; i++ )
            //     {
            //         new_text += '<span style="color:rgb(' + steps[ i ].r + ',' + steps[ i ].g + ',' + steps[ i ].b + ')">' + text[ i ] + '</span>';
            //     }

            //     $text.html( new_text );
            // } );

            return this;
        },

        /**
         * Retrieve every step color between the start and end color
         * @param  {any}     start  Any color format
         * @param  {any}     end    Any color format
         * @param  {integer} count  Number of steps
         * @param  {string}  format 'rgb' or 'hsl'
         * @return {array}          Array of HSL or RGB objects
         */
        get_steps_colors : function( start, end, count, format )
        {
            if( typeof count !== 'number' || count < 2 )
                count = 2;

            start = this.rgb_to_hsl( this.any_to_rgb( start ) );
            end   = this.rgb_to_hsl( this.any_to_rgb( end ) );

            var steps = [],
                ratio = 0,
                step  = {};

            for( var i = 0; i < count + 1; i++ )
            {
                ratio = i / count;

                step.h = start.h + ( end.h - start.h ) * ratio;
                step.s = start.s + ( end.s - start.s ) * ratio;
                step.l = start.l + ( end.l - start.l ) * ratio;

                if( format === 'rgb' )
                    step = this.hsl_to_rgb( step );

                steps.push( step );
            }

            return steps;
        },


        /**
         * Convert from hexa to RGB
         * @param  {string} input Hexa code in 6 char length format
         * @return {object}       RGB object
         */
        hexa_to_rgb : function( input )
        {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( input );

            return {
                r : parseInt( result[ 1 ], 16 ),
                g : parseInt( result[ 2 ], 16 ),
                b : parseInt( result[ 3 ], 16 )
            };
        },

        /**
         * Convert from RGB to HSL
         * @param  {object} input RGB object
         * @return {object}       HSL object
         */
        rgb_to_hsl : function( input )
        {
            input.r /= 255;
            input.g /= 255;
            input.b /= 255;

            var max       = Math.max( input.r, input.g, input.b ),
                min       = Math.min( input.r, input.g, input.b ),
                color_hsl = {};

            color_hsl.h = ( max + min ) / 2;
            color_hsl.s = ( max + min ) / 2;
            color_hsl.l = ( max + min ) / 2;

            if( max === min )
            {
                color_hsl.h = 0;
                color_hsl.s = 0;
            }
            else
            {
                var d = max - min;

                color_hsl.s = color_hsl.l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );

                switch( max )
                {
                    case input.r :
                        color_hsl.h = ( input.g - input.b ) / d + ( input.g < input.b ? 6 : 0 );
                        break;

                    case input.g :
                        color_hsl.h = ( input.b - input.r ) / d + 2;
                        break;

                    case input.b :
                        color_hsl.h = ( input.r - input.g ) / d + 4;
                        break;
                }

                color_hsl.h /= 6;
            }

            return color_hsl;
        },

        /**
         * Convert from HSL to RGB
         * @param  {object} input HSL object
         * @return {object}       RGB object
         */
        hsl_to_rgb : function( input )
        {
            var color_rgb = {};

            if( input.s === 0 )
            {
                color_rgb.r = input.l;
                color_rgb.g = input.l;
                color_rgb.b = input.l;
            }
            else
            {
                var hue2rgb = function hue2rgb( p, q, t )
                {
                    if( t < 0 ) t += 1;
                    if( t > 1 ) t -= 1;
                    if( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
                    if( t < 1 / 2 ) return q;
                    if( t < 2 / 3 ) return p + ( q - p ) * ( 2 / 3 - t ) * 6;
                    return p;
                };

                var q = input.l < 0.5 ? input.l * (1 + input.s) : input.l + input.s - input.l * input.s;
                var p = 2 * input.l - q;

                color_rgb.r = hue2rgb( p, q, input.h  + 1 / 3 );
                color_rgb.g = hue2rgb( p, q, input.h );
                color_rgb.b = hue2rgb( p, q, input.h  - 1 / 3 );
            }

            color_rgb.r = Math.round( color_rgb.r * 255 );
            color_rgb.g = Math.round( color_rgb.g * 255 );
            color_rgb.b = Math.round( color_rgb.b * 255 );

            return color_rgb;
        }
    } );
} )();
