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
        registry  = new B.Tools.Registry( {} );

        // Wait
        window.setTimeout( function()
        {
            done();
        }, 50 );

        // Spies
        spyOn( registry, 'trigger' ).and.callThrough();

        // Use class
        registry.set( 'key', 'value' );
    } );

    // After all
    afterAll( function()
    {

    } );

    it( 'trigger() called', function()
    {
        expect( registry.trigger ).toHaveBeenCalled();
    } );

    it( 'get( \'key\' ) = \'value\'', function()
    {
        expect( registry.get( 'key' ) ).toEqual( 'value' );
    } );
} );
