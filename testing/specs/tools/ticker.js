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
        ticker   = new B.Tools.Ticker( {} );

        // // Wait
        // window.setTimeout( function()
        // {
        //     done();
        // }, 50 );

        // // Spies
        // spyOn( ticker, 'method' ).and.callThrough();
    } );

    // After all
    afterAll( function()
    {

    } );

    // // Expectations
    // it( 'method() called', function()
    // {
    //     expect( ticker.method ).toHaveBeenCalled();
    // } );
} );
