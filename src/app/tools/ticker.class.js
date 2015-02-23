(function()
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
         * INIT
         */
        init : function( options )
        {
            this._super( options );

            this.started                = false;
            this.running                = false;
            this.time                   = {};
            this.time.start             = 0;
            this.time.elapsed           = 0;
            this.time.delta             = 0;
            this.time.current           = 0;
            this.do_next_actions        = {};
            this.do_next_actions.before = [];
            this.do_next_actions.after  = [];

            if( this.options.auto_run )
                this.run();

            B.Tools.Ticker.prototype.instance = this;
        },

        /**
         * START
         */
        start : function( run )
        {
            this.started = true;

            this.time.start   = + ( new Date() );
            this.time.current = this.time.start;
            this.time.elapsed = 0;
            this.time.delta   = 0;

            if( run )
                this.run();
        },

        /**
         * RUN
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
        },

        /**
         * STOP
         */
        stop : function()
        {
            this.running = false;
        },

        /**
         * TICK
         */
        tick : function()
        {
            if( !this.started )
                this.start();

            // Set time infos
            this.time.current = + ( new Date() );
            this.time.delta   = this.time.current - this.time.start - this.time.elapsed;
            this.time.elapsed = this.time.current - this.time.start;

            var i   = 0,
                len = this.do_next_actions.before.length;

            // Do next (before trigger)
            for( ; i < len; i++ )
            {
                this.do_next_actions.before[ i ].call( this, [ this.time ] );
                this.do_next_actions.before.splice( i, 1 );
            }

            // Trigger
            this.trigger( 'tick', [ this.time ] );

            // Do next (after trigger)
            i   = 0;
            len = this.do_next_actions.after.length;
            for( ; i < len; i++ )
            {
                this.do_next_actions.after[ i ].call( this, [ this.time ] );
                this.do_next_actions.after.splice( i, 1 );
            }
        },

        /**
         * DO NEXT
         */
        do_next : function( action, before )
        {
            if( typeof action !== 'function' )
                return false;

            this.do_next_actions[ before ? 'before' : 'after' ].push( action );
        }
    });
})();
