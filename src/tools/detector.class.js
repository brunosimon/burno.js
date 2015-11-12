/**
 * @class    Detector
 * @author   Bruno SIMON / http://bruno-simon.com
 * @fires    resize
 * @fires    scroll
 * @fires    breakpoint
 * @requires B.Tools.Ticker
 */
B.Tools.Detector = B.Core.Event_Emitter.extend(
{
    static  : 'detector',
    options :
    {
        add_classes_to : [ 'html' ]
    },

    /**
     * Initialise and merge options
     * @constructor
     * @param {object} options Properties to merge with defaults
     */
    construct : function( options )
    {
        this._super( options );

        // Init
        this.init_detection();
        this.init_classes();
    },

    /**
     * Detect engine, browser, system and feature in a specified list and store in 'detect' property
     * @return {object} Context
     */
    init_detection : function()
    {
        // Prepare
        var engine = {
            ie      : 0,
            gecko   : 0,
            webkit  : 0,
            khtml   : 0,
            opera   : 0,
            version : 0,
        };

        var browser = {
            ie      : 0,
            firefox : 0,
            safari  : 0,
            konq    : 0,
            opera   : 0,
            chrome  : 0,
            version : 0,
        };

        var system = {
            windows        : false,
            mac            : false,
            osx            : false,
            iphone         : false,
            ipod           : false,
            ipad           : false,
            ios            : false,
            blackberry     : false,
            android        : false,
            opera_mini     : false,
            windows_mobile : false,
            wii            : false,
            ps             : false,
        };

        var features = {
            touch       : false,
            media_query : false
        };

        // Detect
        var user_agent = navigator.userAgent;
        if( window.opera )
        {
            engine.version = browser.version = window.opera.version();
            engine.opera   = browser.opera   = parseInt( engine.version );
        }
        else if( /AppleWebKit\/(\S+)/.test( user_agent ) || /AppleWebkit\/(\S+)/.test( user_agent ) )
        {
            engine.version = RegExp.$1;
            engine.webkit  = parseInt( engine.version );

            // figure out if it's Chrome or Safari
            if( /Chrome\/(\S+)/.test( user_agent ) )
            {
                browser.version = RegExp.$1;
                browser.chrome  = parseInt( browser.version );
            }
            else if( /Version\/(\S+)/.test( user_agent ) )
            {
                browser.version = RegExp.$1;
                browser.safari  = parseInt( browser.version );
            }
            else
            {
                // Approximate version
                var safariVersion = 1;

                if( engine.webkit < 100 )
                    safariVersion = 1;
                else if( engine.webkit < 312 )
                    safariVersion = 1.2;
                else if( engine.webkit < 412 )
                    safariVersion = 1.3;
                else
                    safariVersion = 2;

                browser.safari = browser.version = safariVersion;
            }
        }
        else if( /KHTML\/(\S+)/.test( user_agent ) || /Konqueror\/([^;]+)/.test( user_agent ) )
        {
            engine.version = browser.version = RegExp.$1;
            engine.khtml   = browser.konq    = parseInt( engine.version );
        }
        else if( /rv:([^\)]+)\) Gecko\/\d{8}/.test( user_agent ) )
        {
            engine.version = RegExp.$1;
            engine.gecko   = parseInt( engine.version );

            // Determine if it's Firefox
            if ( /Firefox\/(\S+)/.test( user_agent ) )
            {
                browser.version = RegExp.$1;
                browser.firefox = parseInt( browser.version );
            }
        }
        else if( /MSIE ([^;]+)/.test( user_agent ) )
        {
            engine.version = browser.version = RegExp.$1;
            engine.ie      = browser.ie      = parseInt( engine.version );
        }
        else if( /Trident.*rv[ :]*(11[\.\d]+)/.test( user_agent ) )
        {
            engine.version = browser.version = RegExp.$1;
            engine.ie      = browser.ie      = parseInt( engine.version );
        }

        // Detect browsers
        browser.ie    = engine.ie;
        browser.opera = engine.opera;

        // Detect platform (using navigator.plateform)
        var plateform  = navigator.platform;
        // system.windows = plateform.indexOf( 'Win' ) === 0;
        // system.mac     = plateform.indexOf( 'Mac' ) === 0;
        // system.x11     = ( plateform === 'X11' ) || ( plateform.indexOf( 'Linux' ) === 0);

        // Detect platform (using navigator.userAgent)
        system.windows = !!user_agent.match( /Win/ );
        system.mac     = !!user_agent.match( /Mac/ );
        // system.x11     = ( plateform === 'X11' ) || ( plateform.indexOf( 'Linux' ) === 0);

        // Detect windows operating systems
        if( system.windows )
        {
            if( /Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test( user_agent ) )
            {
                if( RegExp.$1 === 'NT' )
                {
                    switch( RegExp.$2 )
                    {
                        case '5.0':
                            system.windows = '2000';
                            break;

                        case '5.1':
                            system.windows = 'XP';
                            break;

                        case '6.0':
                            system.windows = 'Vista';
                            break;

                        default:
                            system.windows = 'NT';
                            break;
                    }
                }
                else if( RegExp.$1 === '9x' )
                {
                    system.windows = 'ME';
                }
                else
                {
                    system.windows = RegExp.$1;
                }
            }
        }

        // Detect mobile (mix between OS and device)
        system.nokia          = !!user_agent.match( /Nokia/i );
        system.kindle_fire    = !!user_agent.match( /Silk/ );
        system.iphone         = !!user_agent.match( /iPhone/ );
        system.ipod           = !!user_agent.match( /iPod/ );
        system.ipad           = !!user_agent.match( /iPad/ );
        system.blackberry     = !!user_agent.match( /BlackBerry/ ) || !!user_agent.match( /BB[0-9]+/ ) || !!user_agent.match( /PlayBook/ );
        system.android        = !!user_agent.match( /Android/ );
        system.opera_mini     = !!user_agent.match( /Opera Mini/i );
        system.windows_mobile = !!user_agent.match( /IEMobile/i );

        // iOS / OS X exception
        system.ios = system.iphone || system.ipod || system.ipad;
        system.osx = !system.ios && !!user_agent.match( /OS X/ );

        // Detect gaming systems
        system.wii         = user_agent.indexOf( 'Wii' ) > -1;
        system.playstation = /playstation/i.test( user_agent );

        //Detect features (Not as reliable as Modernizr)
        features.touch       = !!( ( 'ontouchstart' in window ) || window.DocumentTouch && document instanceof DocumentTouch );
        features.media_query = !!( window.matchMedia || window.msMatchMedia );

        // Set up
        this.user_agent = user_agent;
        this.plateform  = plateform;
        this.browser    = browser;
        this.engine     = engine;
        this.system     = system;
        this.features   = features;
        this.categories = [ 'engine', 'browser', 'system', 'features' ];
    },

    /**
     * Add detected informations to the DOM (on <html> by default)
     * @return {object} Context
     */
    init_classes : function()
    {
        // Don't add
        if( !this.options.add_classes_to || this.options.add_classes_to.length === 0 )
            return false;

        // Set up
        var targets  = null,
            selector = null;

        // Each element that need to add classes
        for( var i = 0, len = this.options.add_classes_to.length; i < len; i++ )
        {
            // Selector
            selector = this.options.add_classes_to[ i ];

            // Target
            switch( selector )
            {
                case 'html' :
                    targets = [ document.documentElement ];
                    break;

                case 'body' :
                    targets = [ document.body ];
                    break;

                default :
                    targets = document.querySelectorAll( selector );
                    break;
            }

            // Targets found
            if( targets.length )
            {
                this.classes = [];

                // Each category
                for( var category in this )
                {
                    // Allowed
                    if( this.categories.indexOf( category ) !== -1 )
                    {
                        // Each property in category
                        for( var property in this[ category ] )
                        {
                            var value = this[ category ][ property ];

                            // Ignore version
                            if( property !== 'version' )
                            {
                                // Feature
                                if( category === 'features' )
                                {
                                    this.classes.push( category + '-' + ( value ? '' : 'no-' ) + property );
                                }

                                // Not feature
                                else
                                {
                                    if( value )
                                    {
                                        this.classes.push( category + '-' + property );
                                        if( category === 'browser'  )
                                            this.classes.push( category + '-' + property + '-' + value );
                                    }
                                }
                            }
                        }
                    }
                }

                // Add classes
                for( var j = 0; j < targets.length; j++ )
                    targets[ j ].classList.add.apply( targets[ j ].classList, this.classes );
            }
        }

        return this;
    },

    /**
     * Test media and return false if not compatible
     * @param  {string} condition Condition to test
     * @return {boolean}          Match
     */
    match_media : function( condition )
    {
        if( this.features.media_query || typeof condition !== 'string' || condition === '' )
            return false;

        return !!window.matchMedia( condition ).matches;
    }
} );
