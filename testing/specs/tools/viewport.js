/**
 * Viewport
 */

describe( 'Viewport', function()
{
    // Set up
    var viewport = null;

    // Before all
    beforeAll( function( done )
    {
        // Set up
        B.Statics = {};
        viewport  = new B.Tools.Viewport( {
            disable_hover_on_scroll : true
        } );

        // Wait
        window.setTimeout( function()
        {
            done();
        }, 50 );

        // Spies
        spyOn( viewport, 'resize_handler' ).and.callThrough();
        spyOn( viewport, 'scroll_handler' ).and.callThrough();
    } );

    // After all
    afterAll( function()
    {

    } );

    // Expectations
    it( 'resize_handler() called', function()
    {
        expect( viewport.resize_handler ).toHaveBeenCalled();
    } );

    it( 'scroll_handler() called', function()
    {
        expect( viewport.scroll_handler ).toHaveBeenCalled();
    } );

    it( 'width > 0', function()
    {
        expect( viewport.width ).toBeGreaterThan( 0 );
    } );

    it( 'top >= 0', function()
    {
        expect( viewport.width ).toBeGreaterThan( -1 );
    } );

    it( 'pixel_ratio > 0', function()
    {
        expect( viewport.pixel_ratio ).toBeGreaterThan( 0 );
    } );

    it( 'math_media return true', function()
    {
        var value = viewport.match_media( '(max-width:3000px)' ) || !viewport.detector.features.media_query;

        expect( value ).toBeTruthy();
    } );
} );
