(function()
{
    'use strict';

    B.Tools.Images = B.Core.Abstract.extend(
    {
        static  : 'images',

        /**
         * INIT
         * @param  object options
         * @return Images
         */
        init : function( options )
        {
            this._super( options );
            this.urls    = [];
            this.images  = [];
            this.length  = 0;
            this.loaded  = 0;

            B.Tools.Images.prototype.instance = this;
        },

        /**
         * LOAD URLS THEN CALL CALLBACK FUNCTION
         * @param  {[type]}   urls     [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        load : function(urls,callback)
        {
            var that  = this;

            if(typeof urls === 'string')
                this.urls.push(urls);
            else if(urls instanceof Array)
                this.urls = urls;

            this.images = [];
            this.length = this.urls.length;
            this.loaded = 0;

            for(var i = 0; i < this.length; i++)
            {
                (function()
                {
                    var image = new Image();
                    that.images.push(image);
                    image.onload = function()
                    {
                        that.loaded++;
                        if(that.loaded === that.length)
                            callback.call(that,that.images);
                    };
                    image.src = that.urls[i];
                })();
            }
        },

        /**
         * ADD IMAGE URL TO LOAD
         */
        add : function(urls)
        {
            if(typeof urls === 'string')
                this.urls.push(urls);
            else if(urls instanceof Array)
                this.urls = urls;
        },

        /**
         * GET COORDINATES AND SIZES
         * @param  object  parameters
         */
        get_proportions : function(parameters)
        {
            // Errors
            var errors = [];

            if(typeof parameters.image_width === 'undefined' || parseInt(parameters.image_width,10) === 0)
                errors.push('Image width must be specified');

            if(typeof parameters.image_height === 'undefined' || parseInt(parameters.image_height,10) === 0)
                errors.push('Image height must be specified');

            if(typeof parameters.container_width === 'undefined' || parseInt(parameters.container_width,10) === 0)
                errors.push('Container width must be specified');

            if(typeof parameters.container_height === 'undefined' || parseInt(parameters.container_height,10) === 0)
                errors.push('Container height must be specified');

            if(errors.length)
            {
                // for(var i = 0, len = errors.length; i < len; i++)
                //     console.warn(errors[i]);

                return false;
            }

            // Defaults
            parameters.fit_type    = parameters.fit_type    || 'fill';
            parameters.alignment_x = parameters.alignment_x || 'center';
            parameters.alignment_y = parameters.alignment_y || 'middle';
            parameters.rounding    = parameters.rounding    || 'ceil';
            parameters.coordinates = parameters.coordinates || 'css';

            var proportions  = {},
                image_ratio  = parameters.image_width / parameters.image_height,
                canvas_ratio = parameters.container_width / parameters.container_height,
                width        = 0,
                height       = 0,
                x            = 0,
                y            = 0,
                fit_in       = null;

            // Reformats
            parameters.fit_type    = parameters.fit_type.toLowerCase();
            parameters.alignment_x = parameters.alignment_x.toLowerCase();
            parameters.alignment_y = parameters.alignment_y.toLowerCase();
            parameters.rounding    = parameters.rounding.toLowerCase();
            parameters.coordinates = parameters.coordinates.toLowerCase();

            // Alignment
            if(typeof parameters.alignment_x === undefined || (parameters.alignment_x !== 'left' && parameters.alignment_x !== 'center' && parameters.alignment_x !== 'right'))
                parameters.alignment_x = 'center';
            if(typeof parameters.alignment_y === undefined || (parameters.alignment_y !== 'top' && parameters.alignment_y !== 'middle' && parameters.alignment_y !== 'bottom'))
                parameters.alignment_y = 'middle';

            // Functions
            var set_full_width = function()
            {
                width  = parameters.container_width;
                height = (parameters.container_width / parameters.image_width) * parameters.image_height;
                x      = 0;
                fit_in = 'width';

                switch(parameters.alignment_y)
                {
                    case 'top':
                        y = 0;
                        break;
                    case 'middle':
                        y = (parameters.container_height - height) / 2;
                        break;
                    case 'bottom':
                        y = parameters.container_height - height;
                        break;
                }
            };
            var set_full_height = function()
            {
                height = parameters.container_height;
                width  = (parameters.container_height / parameters.image_height) * parameters.image_width;
                y      = 0;
                fit_in = 'height';

                switch(parameters.alignment_x)
                {
                    case 'left':
                        x = 0;
                        break;
                    case 'center':
                        x = (parameters.container_width - width) / 2;
                        break;
                    case 'right':
                        x = parameters.container_width - width;
                        break;
                }
            };

            // Image must fill the container
            if(parameters.fit_type === 'fill' || parameters.fit_type === 'full')
            {
                if(image_ratio < canvas_ratio)
                    set_full_width();
                else
                    set_full_height();
            }

            else if(parameters.fit_type === 'fit' || parameters.fit_type === 'i sits')
            {
                if(image_ratio < canvas_ratio)
                    set_full_height();
                else
                    set_full_width();
            }

            // Rounding
            if(parameters.rounding === 'ceil' || parameters.rounding === 'round' || parameters.rounding === 'floor')
            {
                width  = Math[parameters.rounding].call(this,width);
                height = Math[parameters.rounding].call(this,height);
                x      = Math[parameters.rounding].call(this,x);
                y      = Math[parameters.rounding].call(this,y);
            }

            // Coordinates
            if(parameters.coordinates === 'cartesian')
            {
                proportions.width  = width;
                proportions.height = height;
                proportions.x      = x;
                proportions.y      = y;
            }
            else
            {
                proportions.width  = width;
                proportions.height = height;
                proportions.left   = x;
                proportions.top    = y;
            }

            // Fit in
            proportions.fit_in = fit_in;

            return proportions;
        }
    });
})();
