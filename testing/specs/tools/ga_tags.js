/**
 * GA_Tags
 */
describe( 'GA_Tags', function()
{
    // Init
    var ga_tags = null;

    // Create element
    var element = document.createElement( 'a' );
    element.setAttribute( 'class', 'b-tag' );
    document.body.appendChild( element );

    // Before all
    beforeAll( function( done )
    {
        // Set up
        B.Statics = {};
        ga_tags   = new B.Tools.GA_Tags( { testing : true } );

        // Wait
        window.setTimeout( function()
        {
            done();
        }, 50 );

        // Spies
        spyOn( ga_tags, 'trigger' ).and.callThrough();

        // Send
        ga_tags.send( {
            category : 'test',
            action : 'test'
        } );
    } );

    // After all
    afterAll( function()
    {

    } );

    // Expectations
    it( 'Parse', function()
    {
        expect( element.getAttribute( 'class' ) ).toContain( ga_tags.options.classes.tagged );
    } );

    it( 'Send empty = false', function()
    {
        var result = ga_tags.send( '' );
        expect( result ).toBeFalsy( ga_tags.options.classes.tagged );
    } );

    it( 'trigger() called', function()
    {
        expect( ga_tags.trigger ).toHaveBeenCalled();
    } );
} );
