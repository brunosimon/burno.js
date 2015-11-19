/**
 * Mouse
 */
describe( 'Mouse', function()
{
    // Init
    var mouse = null;

    // Before all
    beforeAll( function( done )
    {
        // Set up
        B.Statics = {};
        mouse   = new B.Tools.Mouse( {} );

        // // Wait
        // window.setTimeout( function()
        // {
        //     done();
        // }, 50 );

        // // Spies
        // spyOn( mouse, 'method' ).and.callThrough();
    } );

    // After all
    afterAll( function()
    {

    } );

    // // Expectations
    // it( 'method() called', function()
    // {
    //     expect( mouse.method ).toHaveBeenCalled();
    // } );
} );
