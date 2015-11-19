/**
 * Css
 */
describe( 'Css', function()
{
    // Init
    var css     = null,
        element = document.createElement( 'span' );

    // Before all
    beforeAll( function( done )
    {
        // Set up
        B.Statics = {};
        css   = new B.Tools.Css( {} );

        // Wait
        window.setTimeout( function()
        {
            done();
        }, 50 );

        // Spies
        spyOn( css, 'apply' ).and.callThrough();

        // Action
        css.apply( element, { color : 'red' } );
    } );

    // After all
    afterAll( function()
    {

    } );

    // Expectations
    it( 'apply() called', function()
    {
        expect( css.apply ).toHaveBeenCalled();
    } );

    it( 'Préfixes added', function()
    {
        element = document.createElement( 'span' );
        css.apply( element, { mozTransform : 'translateX(20px)' }, true );

        expect( element.style.webkitTransform ).toEqual( 'translateX(20px)' );
        expect( element.style.mozTransform ).toEqual( 'translateX(20px)' );
        expect( element.style.msTransform ).toEqual( 'translateX(20px)' );
        expect( element.style.oTransform ).toEqual( 'translateX(20px)' );
        expect( element.style.transform ).toEqual( 'translateX(20px)' );
    } );

    it( 'Custom préfixes added', function()
    {
        element = document.createElement( 'span' );
        css.apply( element, { mozTransform : 'translateX(20px)' }, [ 'moz', 'webkit' ] );

        expect( element.style.webkitTransform ).toEqual( 'translateX(20px)' );
        expect( element.style.mozTransform ).toEqual( 'translateX(20px)' );
        expect( element.style.msTransform ).not.toEqual( 'translateX(20px)' );
        expect( element.style.oTransform ).not.toEqual( 'translateX(20px)' );
        // expect( element.style.transform ).not.toEqual( 'translateX(20px)' );
    } );
} );
