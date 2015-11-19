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

        breakpoints.remove( 'large' );

        // Wait
        window.setTimeout( function()
        {
            done();
        }, 50 );

        // Spies
        spyOn( breakpoints, 'test' ).and.callThrough();
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
