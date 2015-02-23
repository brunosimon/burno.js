(function()
{
    'use strict';

    B.Tools.Resizer = B.Core.Abstract.extend(
    {
        static  : 'resizer',
        options :
        {
            force_style : true,
            parse       : true,
            auto_resize : true,
            classes     :
            {
                to_resize : 'to-resize',
                content   : 'content'
            }
        },

        /**
         * INIT
         */
        init : function( options )
        {
            this._super( options );

            this.elements = [];

            if( this.options.parse )
                this.parse();

            if( this.options.auto_resize )
                this.init_auto_resize();
        },

        /**
         * INIT AUTO RESIZE
         */
        init_auto_resize : function()
        {
            var that = this;

            this.browser = new B.Tools.Browser();

            this.browser.on( 'resize', function()
            {
                that.resize_all();
            } );
        },

        /**
         * PARSE
         */
        parse : function( target )
        {
            // Default
            target = target || document;

            // Elements
            this.elements = [];
            var containers = target.querySelectorAll( '.' + this.options.classes.to_resize );

            // Each element
            for( var i = 0, len = containers.length; i < len; i++ )
            {

                var container = containers[ i ],
                    content   = container.querySelector( '.' + this.options.classes.content );

                // Content found
                if( content )
                {
                    // Add to elements
                    this.elements.push(
                    {
                        container : container,
                        content   : content
                    } );
                }
            }
        },

        /**
         * RESIZE ALL
         */
        resize_all : function()
        {
            for( var i = 0, len = this.elements.length; i < len; i++ )
            {
                var element = this.elements[ i ];

                this.resize( element.container, element.content );
            }
        },

        /**
         * RESIZE
         */
        resize : function( container, content, force_style )
        {
            // Errors
            var errors = [];

            if( !( container instanceof HTMLElement) )
                errors.push( 'wrong container parameter' );

            if( !( content instanceof HTMLElement) )
                errors.push( 'wrong content parameter' );

            if( errors.length )
            {
                for( var i = 0; i < errors.length; i++ )
                    console.warn( errors[ i ] );

                return false;
            }

            // Parameters
            var parameters = {};
            parameters.container_width  = container.getAttribute( 'data-width' )  || container.getAttribute( 'width' )  || container.offsetWidth;
            parameters.container_height = container.getAttribute( 'data-height' ) || container.getAttribute( 'height' ) || container.offsetHeight;
            parameters.content_width    = content.getAttribute( 'data-width' )    || content.getAttribute( 'width' )    || content.offsetWidth;
            parameters.content_height   = content.getAttribute( 'data-height' )   || content.getAttribute( 'height' )   || content.offsetHeight;
            parameters.fit_type         = content.getAttribute( 'data-fit-type' );
            parameters.align_x          = content.getAttribute( 'data-align-x' );
            parameters.align_y          = content.getAttribute( 'data-align-y' );
            parameters.rounding         = content.getAttribute( 'data-rounding' );

            // Get sizes
            var sizes = this.get_sizes( parameters );

            // Error
            if( !sizes )
                return false;

            // Default force style
            force_style = typeof force_style === 'undefined' ? this.options.force_style : force_style;

            // Force style
            if( force_style )
            {
                // Test current style
                var container_style = window.getComputedStyle( container ),
                    content_style   = window.getComputedStyle( content );

                // Force positioning
                if( container_style.position === 'static' )
                    container.style.position = 'relative';

                if( content_style.position === 'static' )
                    content.style.position = 'absolute';

                // Force overflow
                if( container_style.overflow !== 'hidden' )
                    container.style.overflow = 'hidden';
            }

            // Apply style
            content.style.top    = sizes.css.top;
            content.style.left   = sizes.css.left;
            content.style.width  = sizes.css.width;
            content.style.height = sizes.css.height;
        },

        /**
         * GET SIZES
         */
        get_sizes : function( parameters )
        {
            // Errors
            var errors = [];

            if( typeof parameters.content_width === 'undefined' || parseInt( parameters.content_width, 10 ) === 0 )
                errors.push('content width must be specified');

            if( typeof parameters.content_height === 'undefined' || parseInt( parameters.content_height, 10 ) === 0 )
                errors.push('content height must be specified');

            if( typeof parameters.container_width === 'undefined' || parseInt( parameters.container_width, 10 ) === 0 )
                errors.push('container width must be specified');

            if( typeof parameters.container_height === 'undefined' || parseInt( parameters.container_height, 10 ) === 0 )
                errors.push('container height must be specified');

            if( errors.length )
                return false;

            // Defaults
            parameters.fit_type = parameters.fit_type || 'fill';
            parameters.align_x  = parameters.align_x  || 'center';
            parameters.align_y  = parameters.align_y  || 'center';
            parameters.rounding = parameters.rounding || 'ceil';

            var content_ratio   = parameters.content_width / parameters.content_height,
                container_ratio = parameters.container_width / parameters.container_height,
                width           = 0,
                height          = 0,
                x               = 0,
                y               = 0,
                fit_in          = null;

            // To lower case
            parameters.fit_type = parameters.fit_type.toLowerCase();
            parameters.align_x  = parameters.align_x.toLowerCase();
            parameters.align_y  = parameters.align_y.toLowerCase();
            parameters.rounding = parameters.rounding.toLowerCase();

            // align
            if( typeof parameters.align_x === 'undefined' || [ 'left', 'center', 'middle', 'right' ].indexOf( parameters.align_x ) === -1 )
                parameters.align_x = 'center';
            if( typeof parameters.align_y === 'undefined' || [ 'top', 'center', 'middle', 'bottom' ].indexOf( parameters.align_y ) === -1 )
                parameters.align_y = 'center';

            // Functions
            var set_full_width = function()
            {
                width  = parameters.container_width;
                height = ( parameters.container_width / parameters.content_width ) * parameters.content_height;
                x      = 0;
                fit_in = 'width';

                switch( parameters.align_y )
                {
                    case 'top':
                        y = 0;
                        break;

                    case 'middle':
                    case 'center':
                        y = ( parameters.container_height - height ) / 2;
                        break;

                    case 'bottom':
                        y = parameters.container_height - height;
                        break;
                }
            };
            var set_full_height = function()
            {
                height = parameters.container_height;
                width  = ( parameters.container_height / parameters.content_height ) * parameters.content_width;
                y      = 0;
                fit_in = 'height';

                switch( parameters.align_x )
                {
                    case 'left':
                        x = 0;
                        break;

                    case 'middle':
                    case 'center':
                        x = ( parameters.container_width - width ) / 2;
                        break;

                    case 'right':
                        x = parameters.container_width - width;
                        break;
                }
            };

            // Content should fill the container
            if( [ 'fill', 'full', 'cover' ].indexOf( parameters.fit_type ) !== -1 )
            {
                if( content_ratio < container_ratio )
                    set_full_width();
                else
                    set_full_height();
            }

            // Content should fit in the container
            else if( [ 'fit', 'i sits', 'contain' ].indexOf( parameters.fit_type ) !== -1 )
            {
                if( content_ratio < container_ratio )
                    set_full_height();
                else
                    set_full_width();
            }

            // Rounding
            if( [ 'ceil', 'floor', 'round' ].indexOf( parameters.rounding ) !== -1 )
            {
                width  = Math[ parameters.rounding ].call( this,width );
                height = Math[ parameters.rounding ].call( this,height );
                x      = Math[ parameters.rounding ].call( this,x );
                y      = Math[ parameters.rounding ].call( this,y );
            }

            // Returned sizes
            var sizes = {};

            // Cartesian
            sizes.cartesian        = {};
            sizes.cartesian.width  = width;
            sizes.cartesian.height = height;
            sizes.cartesian.x      = x;
            sizes.cartesian.y      = y;

            // CSS
            sizes.css        = {};
            sizes.css.width  = width + 'px';
            sizes.css.height = height + 'px';
            sizes.css.left   = x + 'px';
            sizes.css.top    = y + 'px';

            // Fit in
            sizes.fit_in = fit_in;

            return sizes;
        }
    });
})();
