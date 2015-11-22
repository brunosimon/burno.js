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
        mouse     = new B.Tools.Mouse( {} );

        // Wait mouse move
        function mouse_move_handle()
        {
            done();
        }

        if (document.addEventListener)
            document.addEventListener( 'mousemove', mouse_move_handle, false );
        else
            document.attachEvent( 'onmousemove', mouse_move_handle, false );

        // Spies
        spyOn( mouse, 'trigger' ).and.callThrough();
    } );

    // After all
    afterAll( function()
    {

    } );

    // Expectations
    it( 'position.x != 0', function()
    {
        expect( mouse.position.x ).not.toEqual( 0 );
    } );

    it( 'position.ratio.x != 0', function()
    {
        expect( mouse.position.ratio.x ).not.toEqual( 0 );
    } );

    it( 'trigger() called', function()
    {
        expect( mouse.trigger ).toHaveBeenCalled();
    } );
} );
