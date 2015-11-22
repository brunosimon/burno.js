/**
 * Detector
 */
describe( 'Detector', function()
{
    // Init
    var detector = null;

    // Before all
    beforeAll( function()
    {
        // Set up
        B.Statics = {};
        detector  = new B.Tools.Detector( { targets : [ 'body' ] } );
    } );

    // After all
    afterAll( function()
    {

    } );

    // Expectations
    it( 'Classes on body', function()
    {
        var body_classes         = document.body.getAttribute( 'class' ),
            contains_touch_class = body_classes.indexOf( 'features-touch' ) !== -1 || body_classes.indexOf( 'features-no-touch' ) !== -1,
            contains_mq_class    = body_classes.indexOf( 'features-media_query' ) !== -1 || body_classes.indexOf( 'features-no-media_query' ) !== -1;

        expect( contains_touch_class ).toBeTruthy();
        expect( contains_mq_class ).toBeTruthy();
    } );

    it( 'Engine found', function()
    {
        var found = false;
        for( var key in detector.engine )
        {
            if( detector.engine[ key ] )
                found = true;
        }

        expect( found ).toBeTruthy();
    } );

    it( 'Browser found', function()
    {
        var found = false;
        for( var key in detector.browser )
        {
            if( detector.browser[ key ] )
                found = true;
        }

        expect( found ).toBeTruthy();
    } );

    it( 'System found', function()
    {
        var found = false;
        for( var key in detector.system )
        {
            if( detector.system[ key ] )
                found = true;
        }

        expect( found ).toBeTruthy();
    } );
} );
