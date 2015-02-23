(function()
{
    'use strict';

    B.Tools.Mouse = B.Core.Event_Emitter.extend(
    {
        static  : 'mouse',
        /**
         * INIT
         */
        init : function( options )
        {
            this._super( options );

            this.browser          = new B.Tools.Browser();
            this.down             = false;
            this.position         = {};
            this.position.x       = 0;
            this.position.y       = 0;
            this.position.ratio   = {};
            this.position.ratio.x = 0;
            this.position.ratio.y = 0;
            this.wheel            = {};
            this.wheel.delta      = 0;

            this.init_events();

            B.Tools.Mouse.prototype.instance = this;
        },

        /**
         * INIT EVENTS
         */
        init_events : function()
        {
            var that = this;

            // Down
            function mouse_down_handle( e )
            {
                that.down = true;

                if( that.trigger( 'down', [ that.position, e.target ] ) === false )
                {
                    console.log('prevented');
                    e.preventDefault();
                }
            }

            // Up
            function mouse_up_handle( e )
            {
                that.down = false;

                that.trigger( 'up', [ that.position, e.target ] );
            }

            // Move
            function mouse_move_handle( e )
            {
                that.position.x = e.clientX;
                that.position.y = e.clientY;

                that.position.ratio.x = that.position.x / that.browser.viewport.width;
                that.position.ratio.y = that.position.y / that.browser.viewport.height;

                that.trigger( 'move', [ that.position, e.target ] );
            }

            // Wheel
            function mouse_wheel_handle( e )
            {
                that.wheel.delta = e.wheelDeltaY || e.wheelDelta || - e.detail;

                if( that.trigger( 'wheel', [ that.wheel.delta ] ) === false )
                {
                    e.preventDefault();
                    return false;
                }
            }

            // Listen
            if (document.addEventListener)
            {
                document.addEventListener( 'mousedown', mouse_down_handle, false );
                document.addEventListener( 'mouseup', mouse_up_handle, false );
                document.addEventListener( 'mousemove', mouse_move_handle, false );
                document.addEventListener( 'mousewheel', mouse_wheel_handle, false );
                document.addEventListener( 'DOMMouseScroll', mouse_wheel_handle, false );
            }
            else
            {
                document.attachEvent( 'onmousedown', mouse_down_handle, false );
                document.attachEvent( 'onmouseup', mouse_up_handle, false );
                document.attachEvent( 'onmousemove', mouse_move_handle, false );
                document.attachEvent( 'onmousewheel', mouse_wheel_handle, false );
            }

        }
    } );
} )();
