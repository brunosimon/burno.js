/**
 * Konami_Code
 */
describe( 'Konami_Code', function()
{
    // Init
    var konami_code = null;

    // Before all
    beforeAll( function( done )
    {
        // Set up
        B.Statics = {};
        konami_code   = new B.Tools.Konami_Code( {} );

        // // Wait
        // window.setTimeout( function()
        // {
        //     done();
        // }, 50 );

        // // Spies
        // spyOn( konami_code, 'method' ).and.callThrough();
    } );

    // After all
    afterAll( function()
    {

    } );

    // // Expectations
    // it( 'method() called', function()
    // {
    //     expect( konami_code.method ).toHaveBeenCalled();
    // } );
} );
