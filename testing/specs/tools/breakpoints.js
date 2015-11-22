/**
 * Breakpoints
 */
describe( 'Breakpoints', function()
{
    // Init
    var breakpoints = null;

    // Before all
    beforeAll( function( done )
    {
        // Set up
        B.Statics   = {};
        breakpoints = new B.Tools.Breakpoints( {
            breakpoints : [
                {
                    name  : 'large',
                    width :
                    {
                        value    : 960,
                        extreme  : 'min',
                        included : false
                    }
                },
                {
                    name  : 'medium',
                    width :
                    {
                        value    : 960,
                        extreme  : 'max',
                        included : true
                    }
                },
                {
                    name  : 'small',
                    width :
                    {
                        value    : 500,
                        extreme  : 'max',
                        included : true
                    },
                    height :
                    {
                        value    : 500,
                        extreme  : 'max',
                        included : true
                    }
                }
            ]
        } );

        // Spies
        spyOn( breakpoints, 'test' ).and.callThrough();
        spyOn( breakpoints, 'trigger' ).and.callThrough();

        // Use class
        breakpoints.remove( 'large' );

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
    it( 'test() called', function()
    {
        expect( breakpoints.test ).toHaveBeenCalled();
    } );

    it( 'trigger() called', function()
    {
        expect( breakpoints.trigger ).toHaveBeenCalled();
    } );

    it( 'first_test false', function()
    {
        expect( breakpoints.first_test ).toBe( false );
    } );

    it( 'all length = 2', function()
    {
        var length = Object.keys( breakpoints.all ).length;
        expect( length ).toBe( 2 );
    } );

    it( 'active length = any Number', function()
    {
        var length = Object.keys( breakpoints.actives ).length;
        expect( length ).toEqual( jasmine.any( Number ) );
    } );

    it( 'is_active() = any Boolean', function()
    {
        expect( breakpoints.is_active( 'large' ) ).toEqual( jasmine.any( Boolean ) );
    } );
} );
