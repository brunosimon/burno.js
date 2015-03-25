/**
 * @class    Strings
 * @author   Bruno SIMON / http://bruno-simon.com
 */
( function()
{
    'use strict';

    B.Tools.Konami_Code = B.Core.Event_Emitter.extend(
    {
        static  : 'konami_code',
        options :
        {
            reset_duration : 1000,
            sequence :
            [
                'up',
                'up',
                'down',
                'down',
                'left',
                'right',
                'left',
                'right',
                'b',
                'a',
            ]
        },

        /**
         * Initialise and merge options
         * @constructor
         * @param {object} options Properties to merge with defaults
         */
        construct : function( options )
        {
            this._super( options );

            this.index    = 0;
            this.timeout  = null;
            this.keyboard = new B.Tools.Keyboard();

            this.listen_to_events();
        },

        /**
         * Listen to events
         * @return {object} Context
         */
        listen_to_events : function()
        {
            var that = this;

            // Listen keyboard down
            this.keyboard.on( 'down', function( keycode, character )
            {
                // Reset timeout
                if( that.timeout )
                    window.clearTimeout( that.timeout );

                // Test char
                if( character === that.options.sequence[ that.index ] )
                {
                    // Progress
                    that.index++;

                    // Timeout
                    that.timeout = window.setTimeout( function()
                    {
                        // Trigger
                        that.trigger( 'timeout', [ that.index ] );

                        // Reset
                        that.index = 0;
                    }, that.options.reset_duration );
                }
                else
                {
                    // Trigger
                    if( that.index )
                        that.trigger( 'wrong', [ that.index ] );

                    // Reset
                    that.index = 0;
                }

                // Complete
                if( that.index >= that.options.sequence.length )
                {
                    // Trigger
                    that.trigger( 'used' );

                    // Reset timeout
                    window.clearTimeout( that.timeout );
                }
            } );
        }
    } );
} )();
