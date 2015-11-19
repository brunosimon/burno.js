/**
 * Example
 */
describe( 'Example', function()
{
    // Init
    var example = null;

    // Before all
    beforeAll( function( done )
    {
        // Set up
        B.Statics = {};
        example   = new B.Example( {} );

        // Wait
        window.setTimeout( function()
        {
            done();
        }, 50 );

        // Spies
        spyOn( example, 'method' ).and.callThrough();
    } );

    // After all
    afterAll( function()
    {

    } );

    // Expectations
    it( 'method() called', function()
    {
        expect( example.method ).toHaveBeenCalled();
    } );
} );
