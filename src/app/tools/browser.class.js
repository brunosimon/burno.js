(function()
{
    'use strict';

    B.Tools.Browser = B.Core.Event_Emitter.extend(
    {
        static  : 'browser',
        options :
        {
            disable_hover_on_scroll : true,
            initial_trigger : true,
            add_classes_to  :
            [
                'body'
            ],
            breakpoints :
            [
                {
                    name     : 'large',
                    limits   :
                    {
                        width :
                        {
                            value    : 960,
                            extreme  : 'min',
                            included : false
                        }
                    }
                },
                {
                    name     : 'medium',
                    limits   :
                    {
                        width :
                        {
                            value    : 960,
                            extreme  : 'max',
                            included : true
                        }
                    }
                },
                {
                    name     : 'small',
                    limits   :
                    {
                        width :
                        {
                            value    : 500,
                            extreme  : 'max',
                            included : true
                        }
                    }
                }
            ]
        },

        /**
         * INIT
         */
        init : function( options )
        {
            var that = this;

            console.log('init');

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

            this.pixel_ratio   = window.devicePixelRatio || 1;
            this.shall_trigger = {};
            this.is            = null;
            this.version       = null;
            // this.mobile      = this.mobile_detection();

            this.init_browser_version();
            this.init_breakpoints();
            this.init_disable_hover_on_scroll();
            this.init_events();

            // Initial trigger
            if( this.options.initial_trigger )
            {
                // Do next frame
                this.ticker.do_next( function()
                {
                    // Trigger scroll and resize
                    that.scroll_handle();
                    that.resize_handle();
                } );
            }

            // B.Tools.Browser.prototype.instance = this;
        },

        /**
         * INIT BREAKPOINTS
         */
        init_breakpoints : function()
        {
            this.breakpoints         = {};
            this.breakpoints.items   = [];
            this.breakpoints.current = null;

            this.add_breakpoints( this.options.breakpoints );
        },

        /**
         * ADD BREAKPOINTS
         */
        add_breakpoint : function( breakpoint )
        {
            this.breakpoints.items.push( breakpoint );
        },

        /**
         * ADD BREAKPOINTS
         */
        add_breakpoints : function( breakpoints )
        {
            for( var i = 0; i < breakpoints.length; i++ )
            {
                this.add_breakpoint( breakpoints[ i ] );
            }
        },

        /**
         * TEST BREAKPOINTS
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
                this.shall_trigger.breakpoint = [ this.breakpoints.current, old_breakpoint ];
            }
        },

        /**
         * INIT DISABLE HOVER ON SCROLL
         * Huge gain in performance when scrolling
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
        },

        /**
         * INIT BROWSER VERSION
         */
        init_browser_version : function()
        {
            var is    = {},
                agent = navigator.userAgent.toLowerCase();

            // Detect browser
            is.opera             = !!window.opera || navigator.userAgent.indexOf( ' OPR/' ) >= 0;
            is.firefox           = typeof InstallTrigger !== 'undefined';
            is.safari            = Object.prototype.toString.call( window.HTMLElement ).indexOf( 'Constructor' ) > 0;
            is.chrome            = !!window.chrome && !is.opera;
            is.internet_explorer = ( ( agent.indexOf( 'msie' ) !== -1 ) && ( agent.indexOf( 'opera' ) === -1 ) );// For use within normal web clients
            is.ipad              = agent.indexOf( 'ipad' ) !== -1;

            // // For use within iPad developer UIWebView
            // // Thanks to Andrew Hedges!
            // var ua = navigator.userAgent;
            // var isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);

            // Alias
            is.O    = is.opera;
            is.FF   = is.firefox;
            is.SAF  = is.safari;
            is.CH   = is.chrome;
            is.IE   = is.internet_explorer;
            is.MSIE = is.internet_explorer;
            is.IPAD = is.ipad;

            this.is = is;

            this.version = false;

            if( this.is.IE )
            {
                var user_agent = navigator.userAgent.toLowerCase();
                this.version = user_agent.indexOf( 'msie' ) !== -1 ? parseInt( user_agent.split( 'msie' )[ 1 ], 10 ) : false;

                this.is[ 'internet_explorer_' + this.version ] = true;
                this.is[ 'IE_' + this.version ] = true;
            }

            // Add classes
            this.add_classes();
        },

        // /**
        //  * GET MOBILE
        //  */
        // mobile_detection : function()
        // {
        //     var checker = {};

        //     checker.iphone     = navigator.userAgent.match( /(iPhone|iPod|iPad)/ );
        //     checker.blackberry = navigator.userAgent.match( /BlackBerry/ );
        //     checker.android    = navigator.userAgent.match( /Android/ );
        //     checker.opera      = navigator.userAgent.match( /Opera Mini/i );
        //     checker.windows    = navigator.userAgent.match( /IEMobile/i );
        //     checker.all        = ( checker.iphone || checker.blackberry || checker.android || checker.opera || checker.windows );

        //     return checker;
        // },

        /**
         * ADD CLASSES
         * Add browser class to wanted elements like <body> or <html>
         */
        add_classes : function()
        {
            var targets = null;
            for( var i = 0, len = this.options.add_classes_to.length; i < len; i++ )
            {
                targets = document.querySelectorAll( this.options.add_classes_to[ i ] );

                if( targets.length )
                {
                    for( var key in this.is )
                    {
                        if( this.is[ key ] )
                        {
                            for( var j = 0; j < targets.length; j++ )
                            {
                                targets[ j ].classList.add( key );
                                if( this.is.IE && this.version )
                                {
                                    targets[ j ].classList.add( key + '-' + this.version );
                                }
                            }
                        }
                    }
                }
            }
        },

        /**
         * INIT EVENTS
         * Start listening events
         */
        init_events : function()
        {
            var that = this;

            // Ticker
            this.ticker.on( 'tick', function()
            {
                that.frame();
            } );

            // Resize
            window.onresize = function()
            {
                that.resize_handle();
            };

            // Scroll
            window.onscroll = function()
            {
                that.scroll_handle();
            };
        },

        /**
         * RESIZE HANDLE
         */
        resize_handle : function()
        {
            this.viewport.width  = window.innerWidth;
            this.viewport.height = window.innerHeight;

            this.test_breakpoints();

            this.shall_trigger.resize = [ this.viewport ];
        },

        /**
         * SCROLL HANDLE
         */
        scroll_handle : function()
        {
            // e = e || window.event;
            // if (e.preventDefault)
            //     e.preventDefault();
            // e.returnValue = false;

            var direction_y = null,
                direction_x = null,
                top         = null,
                left        = null;

            if( this.is.IE && document.compatMode === 'CSS1Compat' )
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

            this.shall_trigger.scroll = [ this.viewport ];
        },

        /**
         * MATH MEDIA
         */
        match_media : function( condition )
        {
            if( !( 'matchMedia' in window ) || typeof condition !== 'string' || condition === '' )
                return false;

            return !!window.matchMedia( condition ).matches;
        },

        /**
         * FRAME
         */
        frame : function()
        {
            var keys = Object.keys( this.shall_trigger );


            for( var i = 0; i < keys.length; i++ )
                this.trigger( keys[ i ], this.shall_trigger[ keys[ i ] ] );

            if( keys.length )
                this.shall_trigger = {};
        }
    } );
} )();
