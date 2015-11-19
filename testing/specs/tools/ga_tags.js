/**
 * GA_Tags
 */
describe( 'GA_Tags', function()
{
    // Init
    var ga_tags = null;

    // Before all
    beforeAll( function( done )
    {
        // Set up
        B.Statics = {};
        ga_tags   = new B.Tools.GA_Tags( {} );

        // // Wait
        // window.setTimeout( function()
        // {
        //     done();
        // }, 50 );

        // // Spies
        // spyOn( ga_tags, 'method' ).and.callThrough();
    } );

    // After all
    afterAll( function()
    {

    } );

    // // Expectations
    // it( 'method() called', function()
    // {
    //     expect( ga_tags.method ).toHaveBeenCalled();
    // } );
} );
