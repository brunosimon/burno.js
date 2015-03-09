/**
 * @class    Keyboard
 * @author   Bruno SIMON / http://bruno-simon.com
 * @fires    down
 * @fires    up
 * @requires B.Tools.Browser
 */
( function()
{
    'use strict';

    B.Tools.Keyboard = B.Core.Event_Emitter.extend(
    {
        static        : 'keyboard',
        options       : {},
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
        },

        /**
         * Initialise and merge options
         * @constructor
         * @param {object} options Properties to merge with defaults
         */
        init : function( options )
        {
            this._super( options );

            this.browser = new B.Tools.Browser();
            this.downs   = [];

            this.listen_to_events();
        },

        /**
         * Listen to events
         * @return {object} Context
         */
        listen_to_events : function()
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

            return this;
        },

        /**
         * Convert a keycode to a char
         * @param  {integer} input Original keycode
         * @return {string}        Output
         */
        keycode_to_character : function( input )
        {
            var output = this.keycode_names[ input ];

            if( !output )
                output = String.fromCharCode( input ).toLowerCase();

            return output;
        },

        /**
         * Test if keys are down
         * @param  {array} inputs Array of char to test as strings
         * @return {boolean}      True if every keys are down
         */
        are_down : function( inputs )
        {
            var down = true;

            for( var i = 0; i < inputs.length; i++ )
            {
                var key = inputs[ i ];

                if( typeof key === 'number' )
                    key = this.keycode_to_character( key );

                if( this.downs.indexOf( key ) === -1 )
                    down = false;
            }

            return down;
        },

        /**
         * Test if key is down
         * @param  {string}  input Char as string
         * @return {boolean}       True if key is down
         */
        is_down : function( input )
        {
            return this.are_down( [ input ] );
        }
    } );
} )();
