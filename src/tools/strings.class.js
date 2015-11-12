/**
 * @class    Strings
 * @author   Bruno SIMON / http://bruno-simon.com
 */
B.Tools.Strings = B.Core.Abstract.extend(
{
    static  : 'strings',
    options : {},
    cases   :
    {
        camel          : [ 'camel', 'camelback', 'compoundnames' ],
        pascal         : [ 'pascal', 'uppercamelcase', 'bumpycaps', 'camelcaps', 'capitalizedwords', 'capwords' ],
        snake          : [ 'snake', 'underscore', 'plissken' ],
        titlesnake     : [ 'titlesnake', 'capitalsnake' ],
        screamingsnake : [ 'screamingsnake', 'uppersnake' ],
        dash           : [ 'dash', 'dashed', 'hyphen', 'kebab', 'spinal' ],
        train          : [ 'train' ],
        space          : [ 'space' ],
        title          : [ 'title' ],
        dot            : [ 'dot' ],
        slash          : [ 'slash', 'forwardslash', 'path' ],
        backslash      : [ 'backslash', 'hack', 'whack', 'escape', 'reverseslash', 'slosh', 'backslant', 'downhill', 'backwhack' ],
        lower          : [ 'lower' ],
        upper          : [ 'upper' ],
        studlycaps     : [ 'studlycaps' ],
        burno          : [ 'burno', 'lol', 'yolo' ],
    },
    negatives :
    [
        '0',
        'false',
        'nop',
        ':(',

        'nee',
        'jo',
        'naï',
        'laa',
        'votch',
        'xeyir',
        'ez',
        'hе nie', 'nie',
        'na',
        'aïlle',
        'ne',
        'nann',
        'né',
        'ma hoke phu', 'hmar te',
        'no',
        'tla', 'hla',
        'pù shi',
        'nò',
        'nej',
        'ei',
        'nei',
        'non',
        'nanni',
        'ara',
        'nein',
        'ohi',
        'nahániri',
        'ʻaole', 'aole',
        'lo',
        'nahin',
        'nem',
        'mba',
        'tidak',
        'iié',
        'ala',
        'thay',
        'oya',
        'ahneo',
        'na',
        'bo',
        'minime',
        'nē',
        'te',
        'neen',
        'не', 'he',
        'tsia',
        'le',
        'kaore',
        'ugui', 'yгvй',
        'nennin', 'nenn',
        'нæй',
        'kheyr',
        'nie',
        'não',
        'nu',
        'нет', 'niet',
        'ag',
        'aiwa',
        'nae',
        'aï',
        'siyo', 'hapana',
        'hindi', 'po',
        'aita',
        'lla',
        'illaï',
        'yuk',
        'kadhu',
        'ไม่', 'maï',
        'hayir',
        'oevoel', 'ug',
        'ні', 'ni',
        'نهين',
        'neni',
        'nage',
        'awa',
        'déedéet',
        'rara',
        'cha'
    ],

    /**
     * Convert a value to any case listed above
     * Return base value if case not found
     * @param  {string} value  Any string value
     * @param  {string} format Any case listed above (allow 'case' at the end and other chars than letters like camEl-CasE)
     * @return {string}        Covnerted value
     */
    convert_case : function( value, format )
    {
        // Clean value
        value = this.trim( value );

        // Clean format
        format = format.toLowerCase();               // To lower
        format = format.replace( /[^[a-z]]*/g, '' ); // normalize
        format = format.replace( /case/g, '' );      // Remove 'case'

        // Find format
        var true_format = null;
        for( var original_name in this.cases )
        {
            for( var synonym_name_key in this.cases[ original_name ] )
            {
                var synonym_name = this.cases[ original_name ][ synonym_name_key ];

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
            case 'titlesnake' :
                for( i = 0, len = parts.length; i < len; i++ )
                    parts[ i ] = parts[ i ].charAt( 0 ).toUpperCase() + parts[ i ].slice( 1 );
                new_value = parts.join( '_' );
                break;
            case 'screamingsnake' :
                new_value = parts.join( '_' );
                new_value = new_value.toUpperCase();
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
    },

    /**
     * Smartly convert to boolean
     * @return {[type]} [description]
     */
    to_boolean : function( value )
    {
        // Clean
        value = '' + value;          // To string
        value = this.trim( value );  // Trim
        value = value.toLowerCase(); // To lower case

        return this.negatives.indexOf( value ) === -1;
    },

    /**
     * Remove start and trailing white spaces
     * @param  {string} value      Value to trim
     * @param  {string} characters Characters to trim
     * @return {string}            Trimed value
     */
    trim : function( value, characters )
    {
        if( typeof characters === 'undefined' )
        {
            return value.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' );
        }
        else
        {
            value = value.replace( new RegExp( '^[' + characters + ']+' ), '' );
            value = value.replace( new RegExp( '[' + characters + ']+$' ), '' );
            return value;
        }
    },

    /**
     * Convert to slug
     * @param  {string} value Value to convert
     * @return {string}       Converted value
     */
    to_slug : function( value )
    {
        // Clean
        value = this.trim( value );  // Trim
        value = value.toLowerCase(); // To lower case

        // Remove accents and special letters
        var from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/,:;',
            to   = 'aaaaaeeeeeiiiiooooouuuunc-----';

        for( var i = 0, len = from.length; i < len; i++ )
            value = value.replace( new RegExp( from.charAt( i ), 'g' ), to.charAt( i ) );

        value = value.replace( /[^a-z0-9 _-]/g, '' ); // Remove invalid resting chars
        value = value.replace( /\s+/g, '-' );        // Collapse whitespace and replace by -
        value = value.replace( /-+/g, '-' );         // Collapse dashes
        value = this.trim( value, '-' );             // Final trim

        return value;
    },

    /**
     * Convert to slug ('to_slug' alias)
     * @param  {string} value Value to convert
     * @return {string}       Converted value
     */
    slugify : function( value )
    {
        return this.to_slug( value );
    }
} );
