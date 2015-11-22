/**
 * Core
 */
describe( 'Core', function()
{
    // Init
    var ticker           = null,
        ParentClass      = null,
        ChildClass      = null,
        first            = null,
        second           = null,
        construct_called = false;

    // Before all
    beforeAll( function()
    {
        // Set up
        B.Statics = {};

        ParentClass = B.Core.Abstract.extend( {
            static  : 'static_name',
            options :
            {
                foo   : 'bar',
                lorem :
                {
                    ipsum   : 'toto',
                    dolores : 'tata'
                }
            },

            construct : function( options )
            {
                this._super( options );

                construct_called = true;
            },

            test : function()
            {
            }
        } );

        ChildClass = ParentClass.extend( {
            options :
            {
                foo   : 'beer',
                lorem :
                {
                    ipsum : 'tutu'
                }
            },

            construct : function( options )
            {
                this._super( options );
            }
        } );

        second = new ChildClass();
    } );

    // After all
    afterAll( function()
    {

    } );

    // Expectations
    it( 'Deep merging', function()
    {
        expect( second.test ).toEqual( jasmine.any( Function ) );
    } );

    it( 'Options deep merging', function()
    {
        expect( second.options.foo ).toEqual( 'beer' );
        expect( second.options.lorem.ipsum ).toEqual( 'tutu' );
        expect( second.options.lorem.dolores ).toEqual( 'tata' );
    } );

    it( 'construct() called on both classes', function()
    {
        expect( construct_called ).toBeTruthy();
    } );

    it( 'Added to statics', function()
    {
        expect( B.Statics.static_name ).toBeDefined();
    } );
} );
