/**
 * @class    Resizer
 * @author   Bruno SIMON / http://bruno-simon.com
 */
( function()
{
    'use strict';

    B.Tools.Ticker = B.Core.Event_Emitter.extend(
    {
        static  : 'ticker',
        options :
        {
            auto_run : true
        },

        /**
         * Initialise and merge options
         * @constructor
         * @param {object} options Properties to merge with defaults
         */
        construct : function( options )
        {
            this._super( options );

            this.reseted                = false;
            this.running                = false;
            this.time                   = {};
            this.time.start             = 0;
            this.time.elapsed           = 0;
            this.time.delta             = 0;
            this.time.current           = 0;
            this.do_next_actions        = {};
            this.do_next_actions.before = [];
            this.do_next_actions.after  = [];
            this.intervals              = {};

            if( this.options.auto_run )
                this.run();
        },

        /**
         * Reset the ticker by setting time infos to 0
         * @param  {boolean} run Start the ticker
         * @return {object}      Context
         */
        reset : function( run )
        {
            this.reseted = true;

            this.time.start   = + ( new Date() );
            this.time.current = this.time.start;
            this.time.elapsed = 0;
            this.time.delta   = 0;

            if( run )
                this.run();

            return this;
        },

        /**
         * Run the ticker
         * @return {object} Context
         */
        run : function()
        {
            var that = this;

            // Already running
            if( this.running )
                return;

            this.running = true;

            var loop = function()
            {
                if(that.running)
                    window.requestAnimationFrame( loop );

                that.tick();
            };

            loop();

            return this;
        },

        /**
         * Stop ticking
         * @return {object} Context
         */
        stop : function()
        {
            this.running = false;

            return this;
        },

        /**
         * Tick (or is it tack ?)
         * @return {object} Context
         */
        tick : function()
        {
            // Reset if needed
            if( !this.reseted )
                this.reset();

            // Set time infos
            this.time.current = + ( new Date() );
            this.time.delta   = this.time.current - this.time.start - this.time.elapsed;
            this.time.elapsed = this.time.current - this.time.start;

            var i   = 0,
                len = this.do_next_actions.before.length;

            // Do next (before trigger)
            for( ; i < len; i++ )
            {
                this.do_next_actions.before[ i ].apply( this, [ this.time ] );
                this.do_next_actions.before.splice( i, 1 );
                i--;
                len--;
            }

            // Trigger
            this.trigger( 'tick', [ this.time ] );

            // Trigger intervals
            this.trigger_intervals();

            // Do next (after trigger)
            i   = 0;
            len = this.do_next_actions.after.length;
            for( ; i < len; i++ )
            {
                this.do_next_actions.after[ i ].apply( this, [ this.time ] );
                this.do_next_actions.after.splice( i, 1 );
                i--;
                len--;
            }

            return this;
        },

        /**
         * Apply function on the next frame
         * @param  {function} action Function to apply
         * @param  {boolean}  before Do before the 'tick' event or after
         * @return {object}          Context
         */
        do_next : function( action, before )
        {
            if( typeof action !== 'function' )
                return false;

            this.do_next_actions[ before ? 'before' : 'after' ].push( action );

            return this;
        },

        /**
         * Create interval
         * @param  {integer} interval Milliseconds between each tick
         * @return {object}           Context
         */
        create_interval : function( interval )
        {
            this.intervals[ interval ] = {
                interval     : interval,
                next_trigger : interval,
                start        : this.time.elapsed,
                last_trigger : this.time.elapsed,
            };

            return this;
        },

        /**
         * Destroy interval
         * @param  {integer} interval Milliseconds between each tick
         * @return {object}           Context
         */
        destroy_interval : function( interval )
        {
            delete this.intervals[ interval ];

            return this;
        },

        /**
         * Trigger intervals
         * @return {object}           Context
         */
        trigger_intervals : function()
        {
            // Each interval
            for( var _key in this.intervals )
            {
                var interval = this.intervals[ _key ];

                // Test if interval should trigger
                if( this.time.elapsed - interval.last_trigger > interval.next_trigger  )
                {
                    // Update next trigger to stay as close as possible to the interval
                    interval.next_trigger = interval.interval - ( this.time.elapsed - interval.start ) % interval.interval;

                    interval.last_trigger = this.time.elapsed;
                    this.trigger( 'tick-' + interval.interval, [ this.time, interval ] );
                }
            }

            return this;
        },

        /**
         * Start listening specified events
         * @param  {string}   names    Events names (can contain namespace)
         * @param  {function} callback Function to apply if events are triggered
         * @return {object}            Context
         */
        on : function( names, callback )
        {
            var that           = this,
                resolved_names = this.resolve_names( names );

            // Each resolved name
            resolved_names.forEach( function( name )
            {
                // Has interval interval
                if( name.match( /^tick([0-9]+)$/) )
                {
                    // Extract interval interval
                    var interval = parseInt( name.replace( /^tick([0-9]+)$/, '$1' ) );

                    // Create interval
                    if( interval )
                        that.create_interval( interval );
                }
            } );

            return this._super( names, callback );
        },

        /**
         * Stop listening specified events
         * @param  {string}   names Events names (can contain namespace or be the namespace only)
         * @return {object}         Context
         */
        off : function( names )
        {
            var that           = this,
                resolved_names = this.resolve_names( names );

            // Each resolved name
            resolved_names.forEach( function( name )
            {
                // Has interval interval
                if( name.match( /^tick([0-9]+)$/) )
                {
                    // Extract interval interval
                    var interval = parseInt( name.replace( /^tick([0-9]+)$/, '$1' ) );

                    // Create interval
                    if( interval )
                        that.destroy_interval( interval );
                }
            } );

            return this._super( names );
        },
    } );
} )();
