/**
 * Ticker
 */
describe( 'Ticker', function()
{
    // Init
    var ticker = null;

    // Before all
    beforeAll( function( done )
    {
        // Set up
        B.Statics = {};
        ticker    = new B.Tools.Ticker( {} );

        // Wait
        window.setTimeout( function()
        {
            done();
        }, 50 );

        window.ticker_wait_method = function(){};

        // Spies
        spyOn( ticker, 'trigger' ).and.callThrough();
        spyOn( ticker, 'create_interval' ).and.callThrough();
        spyOn( ticker, 'destroy_interval' ).and.callThrough();
        spyOn( window, 'ticker_wait_method' ).and.callThrough();

        // Use class
        ticker.on( 'tick-100', function(){} );
        ticker.off( 'tick-100', function(){} );
        ticker.wait( 1, window.ticker_wait_method );
    } );

    // After all
    afterAll( function()
    {

    } );

    // Expectations
    it( 'trigger() called', function()
    {
        expect( ticker.trigger ).toHaveBeenCalled();
    } );

    it( 'create_interval() called using on( \'tick-100\' )', function()
    {
        expect( ticker.trigger ).toHaveBeenCalled();
    } );

    it( 'destroy_interval() called using off( \'tick-100\' )', function()
    {
        expect( ticker.trigger ).toHaveBeenCalled();
    } );

    it( 'time.elapsed != 0', function()
    {
        expect( ticker.time.elapsed ).not.toEqual( 0 );
    } );

    it( 'wait() applied function', function()
    {
        expect( window.ticker_wait_method ).toHaveBeenCalled();
    } );
} );
