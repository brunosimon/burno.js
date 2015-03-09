/**
 * @class    GA_Tags
 * @author   Bruno SIMON / http://bruno-simon.com
 * @fires    send
 */
( function()
{
    'use strict';

    B.Tools.GA_Tags = B.Core.Event_Emitter.extend(
    {
        static  : 'ga_tags',
        options :
        {
            send               : true,
            parse              : true,
            true_link_duration : 300,
            target  : document.body,
            classes :
            {
                to_tag : 'tag',
                tagged : 'tagged'
            },
            logs :
            {
                warnings : false,
                send     : false
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

            this.unique_sent = [];

            if( this.options.parse )
                this.parse();
        },

        /**
         * Parse the target looking for tags
         * @param  {HTMLElement} target   HTML target (default body)
         * @param  {string}      selector Query selector
         * @return {object}               Context
         */
        parse : function( target, selector )
        {
            target   = target   || this.options.target;
            selector = selector || this.options.classes.to_tag;

            var that     = this,
                elements = target.querySelectorAll( '.' + selector );

            function click_handle( e )
            {
                e = e || window.event;

                // Set variables
                var element   = this,
                    true_link = element.getAttribute( 'data-tag-true-link' ),
                    datas     = {};

                // True link interpretation
                if( [ '0', 'false', 'nop', 'no' ].indexOf( true_link ) !== -1 )
                    true_link = false;
                else
                    true_link = true;

                // Set options that will be sent
                datas.category = element.getAttribute( 'data-tag-category' );
                datas.action   = element.getAttribute( 'data-tag-action' );
                datas.label    = element.getAttribute( 'data-tag-label' );
                datas.value    = element.getAttribute( 'data-tag-value' );
                datas.unique   = element.getAttribute( 'data-tag-unique' );

                // Send
                that.send( datas );

                // True link that should act as a normal click
                if( true_link )
                {
                    // Set variables
                    var href   = element.getAttribute( 'href' ),
                        target = element.getAttribute( 'target' );

                    // Default target
                    if( !target )
                        target = '_self';

                    // Other than _blank, need to wait
                    if( target !== '_blank' )
                    {
                        // Wait
                        window.setTimeout( function()
                        {
                            window.open( href , target );
                        }, that.options.true_link_duration );

                        // Prevent default
                        if( e.preventDefault )
                            e.preventDefault();
                        else
                            e.returnValue = false;
                    }
                }
            }

            // Each element
            for( var i = 0, len = elements.length; i < len; i++ )
            {
                var element = elements[ i ];

                if( !element.classList.contains( this.options.classes.tagged ) )
                {
                    // Listen
                    element.onclick = click_handle;

                    // Set tagged class
                    element.classList.add( this.options.classes.tagged );
                }
            }

            return this;
        },

        /**
         * Send to Analytics
         * @param  {object} datas Datas to send
         * @return {object}       Context
         * @example
         *
         *     send( {
         *         category : 'foo',
         *         action   : 'bar',
         *         label    : 'lorem',
         *         value    : 'ipsum'
         *     } )
         *
         */
        send : function( datas )
        {
            var send = [];

            // Error
            if( typeof datas !== 'object' )
            {
                // Logs
                if( this.options.logs.warnings )
                    console.warn( 'tag wrong datas' );

                return false;
            }

            // Unique
            if( datas.unique && this.unique_sent.indexOf( datas.unique ) !== -1 )
            {
                // Logs
                if( this.options.logs.warnings )
                    console.warn( 'tag prevent : ' + datas.unique );

                return false;
            }

            // Send
            if( this.options.send )
            {
                var sent = false;

                // Category
                if( typeof datas.category !== 'undefined' )
                {
                    send.push( datas.category );

                    // Action
                    if( typeof datas.action !== 'undefined' )
                    {
                        send.push( datas.action );

                        // Label
                        if( typeof datas.label !== 'undefined' )
                        {
                            send.push( datas.label );

                            // Value
                            if( typeof datas.value !== 'undefined' )
                            {
                                send.push( datas.value );
                            }
                        }

                        // Send only if category and action set
                        // _gaq
                        if( typeof _gaq !== 'undefined' )
                        {
                            _gaq.push( [ '_trackEvent' ].concat( send ) );

                            sent = true;
                        }

                        // ga
                        else if( typeof ga !== 'undefined' )
                        {
                            ga.apply( ga, [ 'send', 'event' ].concat( send ) );

                            sent = true;
                        }

                        else
                        {
                            // Logs
                            if( this.options.logs.warnings )
                                console.warn( 'tag _gaq not defined' );
                        }

                        // Logs
                        if( this.options.logs.send )
                            console.log( 'tag', send );
                    }
                    else
                    {
                        // Logs
                        if( this.options.logs.warnings )
                            console.warn( 'tag missing action' );
                    }
                }
                else
                {
                    // Logs
                    if( this.options.logs.warnings )
                        console.warn( 'tag missing category' );
                }
            }

            // Well sent
            if( sent )
            {
                // Save in unique_sent array
                if( datas.unique )
                    this.unique_sent.push( datas.unique );

                this.trigger( 'send', [ send ] );
            }

            return this;
        }
    } );
} )();
