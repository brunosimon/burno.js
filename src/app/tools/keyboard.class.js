(function()
{
    'use strict';

    B.Tools.Keyboard = B.Core.Event_Emitter.extend(
    {
        static  : 'keyboard',
        options :
        {
            keycode_names :
            {
                91 : 'cmd',
                17 : 'ctrl',
                32 : 'space',
                16 : 'shift',
                18 : 'alt',
                20 : 'caps',
                9  : 'tab',
                13 : 'enter',
                8  : 'backspace',
                38 : 'up',
                39 : 'right',
                40 : 'down',
                37 : 'left',
                27 : 'esc'
            }
        },

        /**
         * INIT
         */
        init : function( options )
        {
            this._super( options );

            this.browser = new B.Tools.Browser();
            this.downs   = [];

            this.init_events();
        },

        /**
         * INIT EVENTS
         */
        init_events : function()
        {
            var that = this;

            // Down
            window.onkeydown = function( e )
            {
                var character = that.keycode_to_character( e.keyCode );

                if( that.downs.indexOf( character ) === -1 )
                    that.downs.push( character );

                // Trigger and prevend default if asked by return false on callback
                if( that.trigger( 'down', [ e.keyCode, character ] ) === false )
                    e.preventDefault();
            };

            // Up
            window.onkeyup = function( e )
            {
                var character = that.keycode_to_character( e.keyCode );

                if( that.downs.indexOf( character ) !== -1 )
                    that.downs.splice( that.downs.indexOf( character ), 1 );

                that.trigger( 'up', [ e.keyCode, character ] );
            };
        },

        /**
         * KEYCODE TO CHAR
         */
        keycode_to_character : function( keycode )
        {
            var character = this.options.keycode_names[ keycode ];

            if( !character )
                character = String.fromCharCode( keycode ).toLowerCase();

            return character;
        },

        /**
         * ARE DOWN
         */
        are_down : function( keys )
        {
            var down = true;

            for( var i = 0; i < keys.length; i++ )
            {
                var key = keys[ i ];

                if( typeof key === 'number' )
                    key = this.keycode_to_character( key );

                if( this.downs.indexOf( key ) === -1 )
                    down = false;
            }

            return down;
        },

        /**
         * IS DOWN
         */
        is_down : function( key )
        {
            return this.are_down( [ key ] );
        }
    } );
} )();
