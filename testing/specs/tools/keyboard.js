/**
 * Keyboard
 */
describe( 'Keyboard', function()
{
    // Init
    var keyboard = null;

    // Before all
    beforeAll( function( done )
    {
        // Set up
        B.Statics = {};
        keyboard   = new B.Tools.Keyboard( {} );

        // // Wait
        // window.setTimeout( function()
        // {
        //     done();
        // }, 50 );

        // // Spies
        // spyOn( keyboard, 'method' ).and.callThrough();
    } );

    // After all
    afterAll( function()
    {

    } );

    // // Expectations
    // it( 'method() called', function()
    // {
    //     expect( keyboard.method ).toHaveBeenCalled();
    // } );
} );
