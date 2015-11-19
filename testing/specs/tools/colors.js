/**
 * Colors
 */
describe( 'Colors', function()
{
    // Init
    var colors = null;

    // Before all
    beforeAll( function( done )
    {
        // Set up
        B.Statics = {};
        colors    = new B.Tools.Colors( {} );

        // Wait
        window.setTimeout( function()
        {
            done();
        }, 50 );
    } );

    // After all
    afterAll( function()
    {

    } );

    // Expectations
    var red = { r : 255, g : 0, b : 0 };

    it( 'red = red', function()
    {
        expect( colors.any_to_rgb( 'red' ) ).toEqual( red );
    } );

    it( '0xff0000 = red', function()
    {
        expect( colors.any_to_rgb( '0xff0000' ) ).toEqual( red );
    } );

    it( '#f00 = red', function()
    {
        expect( colors.any_to_rgb( 'f00' ) ).toEqual( red );
    } );

    it( '#ff0000 = red', function()
    {
        expect( colors.any_to_rgb( 'ff0000' ) ).toEqual( red );
    } );

    it( 'f00 = red', function()
    {
        expect( colors.any_to_rgb( 'f00' ) ).toEqual( red );
    } );

    it( 'ff0000 = red', function()
    {
        expect( colors.any_to_rgb( 'ff0000' ) ).toEqual( red );
    } );

    it( '{"r":255,"g":0,"b":0} = red', function()
    {
        expect( colors.any_to_rgb( '{"r":255,"g":0,"b":0}' ) ).toEqual( red );
    } );
} );
