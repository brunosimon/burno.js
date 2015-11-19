/**
 * Registry
 */
describe( 'Registry', function()
{
    // Init
    var registry = null;

    // Before all
    beforeAll( function( done )
    {
        // Set up
        B.Statics = {};
        registry   = new B.Tools.Registry( {} );

        // // Wait
        // window.setTimeout( function()
        // {
        //     done();
        // }, 50 );

        // // Spies
        // spyOn( registry, 'method' ).and.callThrough();
    } );

    // After all
    afterAll( function()
    {

    } );

    // // Expectations
    // it( 'method() called', function()
    // {
    //     expect( registry.method ).toHaveBeenCalled();
    // } );
} );
