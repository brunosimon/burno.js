/**
 * @class    Browser
 * @author   Bruno SIMON / http://bruno-simon.com
 * @fires    resize
 * @fires    scroll
 * @fires    breakpoint
 * @requires B.Tools.Ticker
 */
( function()
{
    'use strict';

    B.Tools.Browser = B.Core.Event_Emitter.extend(
    {
        static  : 'browser',
        options :
        {
            disable_hover_on_scroll : true,
            initial_trigger         : true,
            add_classes_to          : [ 'html' ],
            breakpoints             : []
        },

        /**
         * Initialise and merge options
         * @constructor
         * @param {object} options Properties to merge with defaults
         */
        init : function( options )
        {
            this._super( options );

            this.ticker = new B.Tools.Ticker();

            this.viewport             = {};
            this.viewport.top         = 0;
            this.viewport.left        = 0;
            this.viewport.y           = 0;
            this.viewport.x           = 0;
            this.viewport.delta       = {};
            this.viewport.delta.top   = 0;
            this.viewport.delta.left  = 0;
            this.viewport.delta.y     = 0;
            this.viewport.delta.x     = 0;
            this.viewport.direction   = {};
            this.viewport.direction.x = null;
            this.viewport.direction.y = null;
            this.viewport.width       = window.innerWidth;
            this.viewport.height      = window.innerHeight;

            this.pixel_ratio = window.devicePixelRatio || 1;

            this.init_detection();
            this.init_breakpoints();
            this.init_disable_hover_on_scroll();
            this.listen_to_events();

            this.add_detection_classes();
            this.trigger_initial_events();
        },

        /**
         * Listen to events
         * @return {object} Context
         */
        listen_to_events : function()
        {
            var that = this;

            // Resize
            window.onresize = function()
            {
                that.resize_handler();
            };

            // Scroll
            window.onscroll = function()
            {
                that.scroll_handler();
            };

            return this;
        },

        /**
         * Handle the resize event
         * @return {object} Context
         */
        resize_handler : function()
        {
            this.viewport.width  = window.innerWidth;
            this.viewport.height = window.innerHeight;

            this.test_breakpoints();

            this.trigger( 'resize', [ this.viewport ] );

            return this;
        },

        /**
         * Handle the scroll event
         * @return {object} Context
         */
        scroll_handler : function()
        {
            var direction_y = null,
                direction_x = null,
                top         = null,
                left        = null;

            if( this.detect.browser.ie && document.compatMode === 'CSS1Compat' )
            {
                direction_y = window.document.documentElement.scrollTop  > this.viewport.top  ? 'down'  : 'up';
                direction_x = window.document.documentElement.scrollLeft > this.viewport.left ? 'right' : 'left';
                top         = window.document.documentElement.scrollTop;
                left        = window.document.documentElement.scrollLeft;
            }
            else
            {
                direction_y = window.pageYOffset > this.viewport.top  ? 'down'  : 'up';
                direction_x = window.pageXOffset > this.viewport.left ? 'right' : 'left';
                top         = window.pageYOffset;
                left        = window.pageXOffset;
            }

            this.viewport.direction.y = direction_y;
            this.viewport.direction.x = direction_x;
            this.viewport.delta.top   = top  - this.viewport.top;
            this.viewport.delta.left  = left - this.viewport.left;
            this.viewport.delta.y     = this.viewport.delta.top;
            this.viewport.delta.x     = this.viewport.delta.left;
            this.viewport.top         = top;
            this.viewport.left        = left;
            this.viewport.y           = this.viewport.top;
            this.viewport.x           = this.viewport.left;

            this.trigger( 'scroll', [ this.viewport ] );

            return this;
        },

        /**
         * Trigger initial events on next frame
         * @return {object} Context
         */
        trigger_initial_events : function()
        {
            var that = this;

            if( this.options.initial_trigger )
            {
                // Do next frame
                this.ticker.do_next( function()
                {
                    // Trigger scroll and resize
                    that.scroll_handler();
                    that.resize_handler();
                } );
            }

            return this;
        },

        /**
         * Initialise breakpoints
         * @return {object} Context
         */
        init_breakpoints : function()
        {
            this.breakpoints         = {};
            this.breakpoints.items   = [];
            this.breakpoints.current = null;

            this.add_breakpoints( this.options.breakpoints );

            return this;
        },

        /**
         * Add one breakpoint
         * @param {object} breakpoint Breakpoint informations
         * @return {object}           Context
         * @example
         *
         *     add_breakpoint( {
         *         name     : 'large',
         *         limits   :
         *         {
         *             width :
         *             {
         *                 value    : 960,
         *                 extreme  : 'min',
         *                 included : false
         *             }
         *         }
         *     } )
         *
         */
        add_breakpoint : function( breakpoint )
        {
            this.breakpoints.items.push( breakpoint );

            return this;
        },

        /**
         * Add multiple breakpoint
         * @param {array} breakpoints Array of breakpoints
         * @return {object}           Context
         * @example
         *
         *     add_breakpoints( [
         *         {
         *             name     : 'large',
         *             limits   :
         *             {
         *                 width :
         *                 {
         *                     value    : 960,
         *                     extreme  : 'min',
         *                     included : false
         *                 }
         *             }
         *         },
         *         {
         *             name     : 'medium',
         *             limits   :
         *             {
         *                 width :
         *                 {
         *                     value    : 960,
         *                     extreme  : 'max',
         *                     included : true
         *                 }
         *             }
         *         },
         *         {
         *             name     : 'small',
         *             limits   :
         *             {
         *                 width :
         *                 {
         *                     value    : 500,
         *                     extreme  : 'max',
         *                     included : true
         *                 }
         *             }
         *         }
         *     ] )
         *
         */
        add_breakpoints : function( breakpoints )
        {
            for( var i = 0; i < breakpoints.length; i++ )
            {
                this.add_breakpoint( breakpoints[ i ] );
            }

            return this;
        },

        /**
         * Test every breakpoint and trigger 'breakpoint' event if current breakpoint changed
         * @return {object} Context
         */
        test_breakpoints : function()
        {
            // Default to null
            var current_breakpoint = null;

            // Each breakpoint
            for( var i = 0, len = this.breakpoints.items.length; i < len; i++ )
            {
                var breakpoint = this.breakpoints.items[ i ],
                    width      = !breakpoint.limits.width,
                    height     = !breakpoint.limits.height;

                // Width must be tested
                if( !width )
                {
                    // Min
                    if( breakpoint.limits.width.extreme === 'min' )
                    {
                        if(
                            // Included
                            ( breakpoint.limits.width.included && this.viewport.width >= breakpoint.limits.width.value ) ||

                            // Not included
                            ( !breakpoint.limits.width.included && this.viewport.width > breakpoint.limits.width.value )
                        )
                            width = true;
                    }

                    // Max
                    else
                    {
                        if(
                            // Included
                            ( breakpoint.limits.width.included && this.viewport.width <= breakpoint.limits.width.value ) ||

                            // Not included
                            ( !breakpoint.limits.width.included && this.viewport.width < breakpoint.limits.width.value )
                        )
                            width = true;
                    }
                }

                // Height must be tested
                if( !height )
                {
                    // Min
                    if( breakpoint.limits.height.extreme === 'min' )
                    {
                        if(
                            // Included
                            ( breakpoint.limits.height.included && this.viewport.height >= breakpoint.limits.height.value ) ||

                            // Not included
                            ( !breakpoint.limits.height.included && this.viewport.height > breakpoint.limits.height.value )
                        )
                            height = true;
                    }

                    // Max
                    else
                    {
                        if(
                            // Included
                            ( breakpoint.limits.height.included && this.viewport.height <= breakpoint.limits.height.value ) ||

                            // Not included
                            ( !breakpoint.limits.height.included && this.viewport.height < breakpoint.limits.height.value )
                        )
                            height = true;
                    }
                }

                if( width && height )
                {
                    current_breakpoint = breakpoint;
                }
            }

            if( current_breakpoint !== this.breakpoints.current )
            {
                var old_breakpoint            = this.breakpoints.current;
                this.breakpoints.current      = current_breakpoint;
                this.trigger( 'breakpoint', [ this.breakpoints.current, old_breakpoint ] );
            }

            return this;
        },

        /**
         * Disable pointer events on body when scrolling for performance
         * @return {object} Context
         */
        init_disable_hover_on_scroll : function()
        {
            if( !this.options.disable_hover_on_scroll )
                return;

            var that    = this,
                timeout = null,
                active  = false;

            function disable()
            {
                // Clear timeout if exist
                if( timeout )
                    window.clearTimeout( timeout );

                // Not active
                if( !active )
                {
                    // Activate
                    active = true;
                    document.body.style.pointerEvents = 'none';
                }

                timeout = window.setTimeout( function()
                {
                    // Deactivate
                    active = false;
                    document.body.style.pointerEvents = 'auto';
                }, 60 );
            }

            this.on( 'scroll', disable );

            return this;
        },

        /**
         * Detect engine, browser, system and feature in a specified list and store in 'detect' property
         * @return {object} Context
         */
        init_detection : function()
        {
            var detect = {};

            // Prepare
            var engine     = {};
            engine.ie      = 0;
            engine.gecko   = 0;
            engine.webkit  = 0;
            engine.khtml   = 0;
            engine.opera   = 0;
            engine.version = 0;

            var browser = {};
            browser.ie      = 0;
            browser.firefox = 0;
            browser.safari  = 0;
            browser.konq    = 0;
            browser.opera   = 0;
            browser.chrome  = 0;
            browser.safari  = 0;
            browser.version = 0;

            var system            = {};
            system.windows        = false;
            system.mac            = false;
            system.osx            = false;
            system.iphone         = false;
            system.ipod           = false;
            system.ipad           = false;
            system.ios            = false;
            system.blackberry     = false;
            system.android        = false;
            system.opera_mini     = false;
            system.windows_mobile = false;
            system.wii            = false;
            system.ps             = false;

            var features   = {};
            features.touch = false;

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

            this.user_agent      = user_agent;
            this.plateform       = plateform;
            this.detect          = {};
            this.detect.browser  = browser;
            this.detect.engine   = engine;
            this.detect.system   = system;
            this.detect.features = features;
        },

        /**
         * Add detected informations to the DOM (on <html> by default)
         * @return {object} Context
         */
        add_detection_classes : function()
        {
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
                    for( var category in this.detect )
                    {
                        // Each property in category
                        for( var property in this.detect[ category ] )
                        {
                            var value = this.detect[ category ][ property ];

                            if( value && property !== 'ver' )
                            {
                                this.classes.push( category + '-' + property );

                                if( category === 'browser'  )
                                    this.classes.push( category + '-' + property + '-' + value );
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
            if( this.detect.features.media_query || typeof condition !== 'string' || condition === '' )
                return false;

            return !!window.matchMedia( condition ).matches;
        }
    } );
} )();
