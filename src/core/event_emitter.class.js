/**
 * @class  Resizer
 * @author Bruno SIMON / http://bruno-simon.com
 */
B.Core.EventEmitter = B.Core.Event_Emitter = B.Core.Abstract.extend(
{
    static  : false,
    options : {},

    /**
     * Initialise and merge options
     * @constructor
     * @param {object} options Properties to merge with defaults
     */
    construct : function( options )
    {
        this._super( options );

        this.callbacks      = {};
        this.callbacks.base = {};
    },

    /**
     * Start listening specified events
     * @param  {string}   names    Events names (can contain namespace)
     * @param  {function} callback Function to apply if events are triggered
     * @return {object}            Context
     * @example
     *
     *     on( 'event-1.namespace event-2.namespace event-3', function( value )
     *     {
     *         console.log( 'fire !', value );
     *     } );
     */
    on : function( names, callback )
    {
        var that  = this;

        // Errors
        if( typeof names === 'undefined' || names === '' )
        {
            console.warn( 'wrong names' );
            return false;
        }

        if( typeof callback === 'undefined' )
        {
            console.warn( 'wrong callback' );
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

            // Create callback if not exist
            if( !( that.callbacks[ name.namespace ][ name.value ] instanceof Array ) )
                that.callbacks[ name.namespace ][ name.value ] = [];

            // Add callback
            that.callbacks[ name.namespace ][ name.value ].push( callback );
        });

        return this;
    },

    /**
     * Stop listening specified events
     * @param  {string}   names Events names (can contain namespace or be the namespace only)
     * @return {object}         Context
     * @example
     *
     *     off( 'event-1 event-2' );
     *
     *     off( 'event-3.namespace' );
     *
     *     off( '.namespace' );
     *
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

            // Remove specific callback in namespace
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
     * Fires event
     * @param  {string} name Event name (single)
     * @param  {array} args  Arguments to send to callbacks
     * @return {boolean}     First value sent by the callbacks applieds
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
            final_result,
            result;

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
            // Try to find callback in each namespace
            for( var namespace in that.callbacks )
            {
                if( that.callbacks[ namespace ] instanceof Object && that.callbacks[ namespace ][ name.value ] instanceof Array )
                {
                    that.callbacks[ namespace ][ name.value ].forEach( function( callback )
                    {
                        result = callback.apply( that,args );

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

            that.callbacks[ name.namespace ][ name.value ].forEach( function( callback )
            {
                result = callback.apply( that, args );

                if( typeof final_result === 'undefined' )
                    final_result = result;
            });
        }

        return final_result;
    },

    /**
     * Trigga wut say wut
     */
    trigga : function( name, args )
    {
        return this.trigger( name, args );
    },

    /**
     * Dispatch
     */
    dispatch : function( name, args )
    {
        return this.trigger( name, args );
    },

    /**
     * Fire everything !
     * https://www.youtube.com/watch?v=1Io0OQ2zPS4
     */
    fire : function( name, args )
    {
        return this.trigger( name, args );
    },

    /**
     * Resolve events names
     * @param  {string} names Events names
     * @return {array}        Array of names (with namespace included in name)
     */
    resolve_names : function( names )
    {
        names = names.replace( /[^a-zA-Z0-9 ,\/.]/g, '' );
        names = names.replace( /[,\/]+/g, ' ' );
        names = names.split( ' ' );

        return names;
    },

    /**
     * Resolve event name
     * @param  {string} name Event name
     * @return {object}      Event object containing original name, real event name and namespace
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
