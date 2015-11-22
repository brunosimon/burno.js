/**
 * Keyboard
 */
describe( 'Keyboard', function()
{
    // Init
    var keyboard = null;

    // Before all
    beforeAll( function()
    {
        // Set up
        B.Statics = {};
        keyboard  = new B.Tools.Keyboard( {} );
    } );

    // After all
    afterAll( function()
    {

    } );

    // Expectations
    it( 'Keycode to chararacter (cmd, up, a, q)', function()
    {
        expect( keyboard.keycode_to_character( 91 ) ).toEqual( 'cmd' );
        expect( keyboard.keycode_to_character( 38 ) ).toEqual( 'up' );
        expect( keyboard.keycode_to_character( 65 ) ).toEqual( 'a' );
        expect( keyboard.keycode_to_character( 81 ) ).toEqual( 'q' );
    } );

    it( 'are_down( [] ) return true', function()
    {
        expect( keyboard.are_down( [] ) ).toBeTruthy();
    } );

    it( 'are_down( [ \'a\' ] ) return false', function()
    {
        expect( keyboard.are_down( [ 'a' ] ) ).toBeFalsy();
    } );

    it( 'are_down( [ 65 ] ) return false', function()
    {
        expect( keyboard.are_down( [ 65 ] ) ).toBeFalsy();
    } );
} );
