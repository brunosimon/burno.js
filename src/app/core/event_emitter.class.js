(function()
{
    'use strict';

    B.Core.Event_Emitter = B.Core.Abstract.extend(
    {
        static  : false,
        options : {},

        /**
         * INIT
         */
        init : function( options )
        {
            this._super( options );

            this.callbacks      = {};
            this.callbacks.base = {};
        },

        /**
         * ON
         */
        on : function( names, action )
        {
            var that  = this;

            // Errors
            if( typeof names === 'undefined' || names === '' )
            {
                console.warn( 'wrong names' );
                return false;
            }

            if( typeof action === 'undefined' )
            {
                console.warn( 'wrong action' );
                return false;
            }

            // Resolve names
            names = this.resolve_names( names );

            // Each name
            names.forEach( function( name )
            {
                // Resolve name
                name = that.resolve_name( name );

                // Create namespace if not exist
                if( !( that.callbacks[ name.namespace ] instanceof Object ) )
                    that.callbacks[ name.namespace ] = {};

                // Create action if not exist
                if( !( that.callbacks[ name.namespace ][ name.value ] instanceof Array ) )
                    that.callbacks[ name.namespace ][ name.value ] = [];

                // Add action
                that.callbacks[ name.namespace ][ name.value ].push( action );
            });

            return this;
        },

        /**
         * OFF
         */
        off : function( names )
        {
            var that = this;

            // Errors
            if( typeof names === 'undefined' || names === '' )
            {
                console.warn( 'wrong name' );
                return false;
            }

            // Resolve names
            names = this.resolve_names( names );

            // Each name
            names.forEach( function( name )
            {
                // Resolve name
                name = that.resolve_name( name );

                // Remove namespace
                if( name.namespace !== 'base' && name.value === '' )
                {
                    delete that.callbacks[ name.namespace ];
                }

                // Remove specific action in namespace
                else
                {
                    // Default
                    if( name.namespace === 'base' )
                    {
                        // Try to remove from each namespace
                        for( var namespace in that.callbacks )
                        {
                            if( that.callbacks[ namespace ] instanceof Object && that.callbacks[ namespace ][ name.value ] instanceof Array )
                            {
                                delete that.callbacks[ namespace ][ name.value ];

                                // Remove namespace if empty
                                if( Object.keys(that.callbacks[ namespace ] ).length === 0 )
                                    delete that.callbacks[ namespace ];
                            }
                        }
                    }

                    // Specified namespace
                    else if( that.callbacks[ name.namespace ] instanceof Object && that.callbacks[ name.namespace ][ name.value ] instanceof Array )
                    {
                        delete that.callbacks[ name.namespace ][ name.value ];

                        // Remove namespace if empty
                        if( Object.keys( that.callbacks[ name.namespace ] ).length === 0 )
                            delete that.callbacks[ name.namespace ];
                    }
                }
            });

            return this;
        },

        /**
         * TRIGGER
         */
        trigger : function( name, args )
        {
            // Errors
            if( typeof name === 'undefined' || name === '' )
            {
                console.warn( 'wrong name' );
                return false;
            }

            var that         = this,
                final_result = undefined,
                result       = undefined;

            // Default args
            if( !( args instanceof Array ) )
                args = [];

            // Resolve names (should on have one event)
            name = this.resolve_names( name );

            // Resolve name
            name = that.resolve_name( name[ 0 ] );

            // Default namespace
            if( name.namespace === 'base' )
            {
                // Try to find action in each namespace
                for( var namespace in that.callbacks )
                {
                    if( that.callbacks[ namespace ] instanceof Object && that.callbacks[ namespace ][ name.value ] instanceof Array )
                    {
                        that.callbacks[ namespace ][ name.value ].forEach( function( action )
                        {
                            result = action.apply( that,args );

                            if( typeof final_result === 'undefined' )
                                final_result = result;
                        } );
                    }
                }
            }

            // Specified namespace
            else if( this.callbacks[ name.namespace ] instanceof Object )
            {
                if( name.value === '' )
                {
                    console.warn( 'wrong name' );
                    return this;
                }

                that.callbacks[ name.namespace ][ name.value ].forEach( function( action )
                {
                    result = action.apply( that, args );

                    if( typeof final_result === 'undefined' )
                        final_result = result;
                });
            }

            return final_result;
        },

        /**
         * TRIGGA NIGGA WUT
         */
        trigga : function( name, args )
        {
            return this.trigger( name, args );
        },

        /**
         * RESOLVE NAMES
         */
        resolve_names : function( names )
        {
            names = names.replace( /[^a-zA-Z0-9 ,\/.]/g, '' );
            names = names.replace( /[,\/]+/g, ' ' );
            names = names.split( ' ' );

            return names;
        },

        /**
         * RESOLVE NAME
         */
        resolve_name : function( name )
        {
            var new_name = {},

            parts = name.split( '.' );

            new_name.original  = name;
            new_name.value     = parts[ 0 ];
            new_name.namespace = 'base'; // Base namespace

            // Specified namespace
            if( parts.length > 1 && parts[ 1 ] !== '' )
                new_name.namespace = parts[ 1 ];

            return new_name;
        }
    } );
} )();
