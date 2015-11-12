/**
 * @class    Viewport
 * @author   Bruno SIMON / http://bruno-simon.com
 * @fires    resize
 * @fires    scroll
 * @requires B.Tools.Ticker
 */
B.Tools.Viewport = B.Core.Event_Emitter.extend(
{
    static  : 'viewport',
    options :
    {
        disable_hover_on_scroll : false,
        initial_triggers        : [ 'resize', 'scroll' ],
        add_classes_to          : [ 'html' ],
    },

    /**
     * Initialise and merge options
     * @constructor
     * @param {object} options Properties to merge with defaults
     */
    construct : function( options )
    {
        this._super( options );

        // Set up
        this.ticker             = new B.Tools.Ticker();
        this.top                = 0;
        this.left               = 0;
        this.y                  = 0;
        this.x                  = 0;
        this.scroll             = {};
        this.scroll.delta       = {};
        this.scroll.delta.top   = 0;
        this.scroll.delta.left  = 0;
        this.scroll.delta.y     = 0;
        this.scroll.delta.x     = 0;
        this.scroll.direction   = {};
        this.scroll.direction.x = null;
        this.scroll.direction.y = null;
        this.width              = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth;
        this.height             = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.pixel_ratio        = window.devicePixelRatio || 1;

        // Init
        this.init_disabling_hover_on_scroll();
        this.init_events();
    },

    /**
     * Init events
     * @return {object} Context
     */
    init_events : function()
    {
        var that = this;

        // Callbacks
        function resize_callback()
        {
            that.resize_handler();
        }
        function scroll_callback()
        {
            that.scroll_handler();
        }

        // Listeing to events
        if( window.addEventListener )
        {
            window.addEventListener( 'resize', resize_callback );
            window.addEventListener( 'scroll', scroll_callback );
        }
        else
        {
            window.attachEvent( 'onresize', resize_callback );
            window.attachEvent( 'onscroll', scroll_callback );
        }

        // Initial trigger
        if( this.options.initial_triggers.length )
        {
            // Do next frame
            this.ticker.wait( 1, function()
            {
                // Each initial trigger
                for( var i = 0; i < that.options.initial_triggers.length; i++ )
                {
                    // Set up
                    var action = that.options.initial_triggers[ i ],
                        method = that[ action + '_handler' ];

                    // Method exist
                    if( typeof method === 'function' )
                    {
                        // Trigger
                        method.apply( that );
                    }
                }
            } );
        }

        return this;
    },

    /**
     * Handle the resize event
     * @return {object} Context
     */
    resize_handler : function()
    {
        // Set up
        this.width  = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth;
        this.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        // Trigger
        this.trigger( 'resize', [ this.width, this.height ] );

        return this;
    },

    /**
     * Handle the scroll event
     * @return {object} Context
     */
    scroll_handler : function()
    {
        // Set up
        var top  = typeof window.pageYOffset !== 'undefined' ? window.pageYOffset : window.document.documentElement.scrollTop,
            left = typeof window.pageXOffset !== 'undefined' ? window.pageXOffset : window.document.documentElement.scrollLeft;

        this.scroll.direction.y = top  > this.top  ? 'down'  : 'up';
        this.scroll.direction.x = left > this.left ? 'right' : 'left';
        this.scroll.delta.top   = top  - this.top;
        this.scroll.delta.left  = left - this.left;
        this.top                = top;
        this.left               = left;

        // Alias
        this.y              = this.top;
        this.x              = this.left;
        this.scroll.delta.y = this.scroll.delta.top;
        this.scroll.delta.x = this.scroll.delta.left;

        // Trigger
        this.trigger( 'scroll', [ this.top, this.left, this.scroll ] );

        return this;
    },

    /**
     * Disable pointer events on body when scrolling for performance
     * @return {object} Context
     */
    init_disabling_hover_on_scroll : function()
    {
        // Set up
        var that    = this,
            timeout = null,
            active  = false;

        // Scroll event
        this.on( 'scroll', function()
        {
            if( !that.options.disable_hover_on_scroll )
                return;

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
        } );

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
