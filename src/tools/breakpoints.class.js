/**
 * @class    Breakpoints
 * @author   Bruno SIMON / http://bruno-simon.com
 * @fires    update
 * @fires    change
 * @requires B.Tools.Viewport
 */
B.Tools.Breakpoints = B.Core.Event_Emitter.extend(
{
    static  : 'breakpoints',
    options :
    {
        breakpoints : []
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
        this.viewport = new B.Tools.Viewport();
        this.all      = {};
        this.actives  = {};

        // Initial breakpoints
        this.add( this.options.breakpoints );

        // Init
        this.init_events();
    },

    /**
     * Listen to events
     * @return {object} Context
     */
    init_events : function()
    {
        var that = this;

        // Viewport resize event
        this.viewport.on( 'resize', function()
        {
            // Test breakpoints
            that.test();
        } );

        return this;
    },

    /**
     * Add one breakpoint
     * @param {object} breakpoint Breakpoint informations
     * @return {object}           Context
     * @example
     *     add( {
     *         name  : 'large',
     *         width :
     *         {
     *             value    : 960,
     *             extreme  : 'min',
     *             included : false
     *         }
     *     } )
     * @example
     *     add_breakpoints( [
     *          {
     *              name  : 'large',
     *              width :
     *              {
     *                  value    : 960,
     *                  extreme  : 'min',
     *                  included : false
     *              }
     *          },
     *          {
     *              name  : 'medium',
     *              width :
     *              {
     *                  value    : 960,
     *                  extreme  : 'max',
     *                  included : true
     *              }
     *          },
     *          {
     *              name  : 'small',
     *              width :
     *              {
     *                  value    : 500,
     *                  extreme  : 'max',
     *                  included : true
     *              },
     *              height :
     *              {
     *                  value    : 500,
     *                  extreme  : 'max',
     *                  included : true
     *              }
     *          }
     *     ] )
     *
     */
    add : function( breakpoints, silent )
    {
        // Default
        silent = typeof silent === 'undefined' ? true : false;

        // Force array
        if( !( breakpoints instanceof Array ) )
            breakpoints = [ breakpoints ];

        // Add each one to breakpoints
        for( var i = 0; i < breakpoints.length; i++ )
        {
            var breakpoint = breakpoints[ i ];
            this.all[ breakpoint.name ] = breakpoint;
        }

        // Test breakpoints
        if( !silent )
            this.test();

        return this;
    },

    /**
     * Remove one breakpoint
     * @param  {string} breakpoint Breakpoint name (can be the breakpoint object itself)
     * @return {object}            Context
     */
    remove : function( breakpoints, silent )
    {
        // Force array
        if( !( breakpoints instanceof Array ) )
            breakpoints = [ breakpoints ];

        // Object breakpoint
        if( typeof breakpoint === 'object' && typeof breakpoint.name === 'string' )
            breakpoint = breakpoint.name;

        // Default
        silent = typeof silent === 'undefined' ? false : true;

        // Add each one to breakpoints
        for( var i = 0; i < breakpoints.length; i++ )
        {
            delete this.all[ breakpoints[ i ] ];
        }

        // Test breakpoints
        if( !silent )
            this.test();

        return this;
    },

    /**
     * Test every breakpoint and trigger 'update' event if current breakpoint changed
     * @return {object} Context
     */
    test : function()
    {
        // Set up
        var current_breakpoints = {},
            all_names           = Object.keys( this.all );

        // Each breakpoint
        for( var i = 0, len = all_names.length; i < len; i++ )
        {
            // Set up
            var breakpoint = this.all[ all_names[ i ] ],
                width      = !breakpoint.width,
                height     = !breakpoint.height;

            // Width must be tested
            if( !width )
            {
                // Min
                if( breakpoint.width.extreme === 'min' )
                {
                    if(
                        // Included
                        ( breakpoint.width.included && this.viewport.width >= breakpoint.width.value ) ||

                        // Not included
                        ( !breakpoint.width.included && this.viewport.width > breakpoint.width.value )
                    )
                        width = true;
                }

                // Max
                else
                {
                    if(
                        // Included
                        ( breakpoint.width.included && this.viewport.width <= breakpoint.width.value ) ||

                        // Not included
                        ( !breakpoint.width.included && this.viewport.width < breakpoint.width.value )
                    )
                        width = true;
                }
            }

            // Height must be tested
            if( !height )
            {
                // Min
                if( breakpoint.height.extreme === 'min' )
                {
                    if(
                        // Included
                        ( breakpoint.height.included && this.viewport.height >= breakpoint.height.value ) ||

                        // Not included
                        ( !breakpoint.height.included && this.viewport.height > breakpoint.height.value )
                    )
                        height = true;
                }

                // Max
                else
                {
                    if(
                        // Included
                        ( breakpoint.height.included && this.viewport.height <= breakpoint.height.value ) ||

                        // Not included
                        ( !breakpoint.height.included && this.viewport.height < breakpoint.height.value )
                    )
                        height = true;
                }
            }

            if( width && height )
            {
                current_breakpoints[ breakpoint.name ] = breakpoint;
            }
        }

        // Set up
        var current_names = Object.keys( current_breakpoints ),
            old_names     = Object.keys( this.actives ),
            difference    = this.get_arrays_differences( current_names, old_names );

        if( difference.length )
        {
            this.actives = current_breakpoints;
            this.trigger( 'update change', [ this.actives ] );
        }

        return this;
    },

    /**
     * Test if breakpoint is active
     * @param  {string}  breakpoint Breakpoint name (can be the breakpoint object itself)
     * @return {boolean}            True or false depending on if the breakpoint is active
     */
    is_active : function( breakpoint )
    {
        // Object breakpoint
        if( typeof breakpoint === 'object' && typeof breakpoint.name === 'string' )
            breakpoint = breakpoint.name;

        return typeof this.actives[ breakpoint ] !== 'undefined';
    },

    /**
     * Get differences between two arrays
     * @param  {array} a First array
     * @param  {array} b Second array
     * @return {array}   Items in one but not in the other
     */
    get_arrays_differences : function( a, b )
    {
        var a_new = [],
            diff  = [];

        for( var i = 0; i < a.length; i++ )
            a_new[ a[ i ] ] = true;

        for( i = 0; i < b.length; i++ )
        {
            if( a_new[ b[ i ] ] )
                delete a_new[ b[ i ] ];
            else
                a_new[ b[ i ] ] = true;
        }

        for( var k in a_new )
            diff.push( k );

        return diff;
    }
} );
