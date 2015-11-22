/**
 * Resizer
 */
describe( 'Resizer', function()
{
    // Init
    var resizer = null;

    // Create elements
    var element = document.createElement( 'div' );
    element.setAttribute( 'class', 'b-resize' );

    var inner_element = document.createElement( 'div' );
    inner_element.setAttribute( 'class', 'b-content' );
    element.appendChild( inner_element );

    document.body.appendChild( element );

    // Before all
    beforeAll( function( done )
    {
        // Set up
        B.Statics = {};
        resizer   = new B.Tools.Resizer( {} );

        // Wait
        window.setTimeout( function()
        {
            done();
        }, 50 );

        // Spies
        spyOn( resizer, 'resize_all' ).and.callThrough();
        spyOn( resizer, 'resize' ).and.callThrough();
    } );

    // After all
    afterAll( function()
    {

    } );

    // Expectations
    it( 'resize_all() called', function()
    {
        expect( resizer.resize_all ).toHaveBeenCalled();
    } );

    it( 'resize() called', function()
    {
        expect( resizer.resize ).toHaveBeenCalled();
    } );

    it( 'get_sizes() default', function()
    {
        var sizes = resizer.get_sizes( {
            container_width  : 200,
            container_height : 200,
            content_width    : 100,
            content_height   : 200,
        } );

        expect( sizes.cartesian.y ).toEqual( -100 );
    } );

    it( 'get_sizes() width format', function()
    {
        var sizes = resizer.get_sizes( {
            container_width  : 200,
            container_height : 200,
            content_width    : 100,
            content_height   : 200,
        }, 'css' );

        expect( sizes.top ).toEqual( '-100px' );
    } );

    it( 'get_sizes() with fit type', function()
    {
        var sizes = resizer.get_sizes( {
            container_width  : 200,
            container_height : 200,
            content_width    : 100,
            content_height   : 200,
            fit_type         : 'fit'
        } );

        expect( sizes.cartesian.x ).toEqual( 50 );
    } );

    it( 'get_sizes() with align x', function()
    {
        var sizes = resizer.get_sizes( {
            container_width  : 200,
            container_height : 200,
            content_width    : 100,
            content_height   : 200,
            fit_type         : 'fit',
            align_x          : 'right'
        } );

        expect( sizes.cartesian.x ).toEqual( 100 );
    } );

    it( 'get_sizes() with rounding', function()
    {
        var sizes = resizer.get_sizes( {
            container_width  : 199.5,
            container_height : 200,
            content_width    : 100,
            content_height   : 200,
            rounding         : 'floor'
        } );

        expect( sizes.cartesian.width ).toEqual( 199 );
    } );
} );
