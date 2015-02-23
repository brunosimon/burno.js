(function()
{
    'use strict';

    B.Components.App = B.Core.Abstract.extend(
    {
        options:
        {

        },

        /**
         * INIT
         */
        init : function( options )
        {
            this._super( options );

            this.ticker   = new B.Tools.Ticker();
            this.browser  = new B.Tools.Browser();
            this.css      = new B.Tools.Css();
            this.keyboard = new B.Tools.Keyboard();
            this.mouse    = new B.Tools.Mouse();
            this.ga_tags  = new B.Tools.GA_Tags();

            console.log( 'All good' );
        }
    } );
} )();
