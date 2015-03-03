/**
 * @class    Offline
 * @author   Bruno SIMON / http://bruno-simon.com
 * @fires    online
 * @fires    offline
 * @fires    change
 */
( function()
{
    'use strict';

    B.Tools.Offline = B.Core.Event_Emitter.extend(
    {
        static  : 'offline',
        options :
        {
            classes :
            {
                active  : true,
                target  : document.body,
                offline : 'offline',
                online  : 'online'
            }
        },

        /**
         * Initialise and merge options
         * @constructor
         * @param {object} options Properties to merge with defaults
         */
        init : function( options )
        {
            this._super( options );

            this.status = null;

            this.listen_to_events();
        },

        /**
         * Listen to events
         * @return {object} Context
         */
        listen_to_events : function()
        {
            var that = this;

            function change()
            {
                // Online
                if( navigator.onLine )
                {
                    // Update classes
                    if( that.options.classes.active )
                    {
                        that.options.classes.target.classList.remove( that.options.classes.offline );
                        that.options.classes.target.classList.add( that.options.classes.online );
                    }

                    // Update status
                    that.status = 'online';

                    // Trigger
                    that.trigger( 'online' );
                    that.trigger( 'change', [ that.status ] );
                }

                // Offline
                else
                {
                    // Update classes
                    if( that.options.classes.active )
                    {
                        that.options.classes.target.classList.remove( that.options.classes.online );
                        that.options.classes.target.classList.add( that.options.classes.offline );
                    }

                    // Update status
                    that.status = 'online';

                    // Trigger
                    that.trigger( 'offline' );
                    that.trigger( 'change', [ that.status ] );
                }
            }

            // Listen
            if( window.addEventListener )
            {
                window.addEventListener( 'online',  change, false );
                window.addEventListener( 'offline', change, false );
            }
            else
            {
                document.body.ononline  = change;
                document.body.onoffline = change;
            }

            change();

            return this;
        }
    } );
} )();
