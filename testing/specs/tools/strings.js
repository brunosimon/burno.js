/**
 * Strings
 */
describe( 'Strings', function()
{
    // Init
    var strings = null;

    // Before all
    beforeAll( function()
    {
        // Set up
        B.Statics = {};
        strings   = new B.Tools.Strings( {} );
    } );

    // After all
    afterAll( function()
    {

    } );

    // Expectations
    it( 'convert_case() to camelCase', function()
    {
        expect( strings.convert_case( 'loremIpsumDolores', 'camel' ) ).toEqual( 'loremIpsumDolores' );
    } );

    it( 'convert_case() to PascalCase', function()
    {
        expect( strings.convert_case( 'loremIpsumDolores', 'pascal' ) ).toEqual( 'LoremIpsumDolores' );
    } );

    it( 'convert_case() to snake_case', function()
    {
        expect( strings.convert_case( 'loremIpsumDolores', 'snake' ) ).toEqual( 'lorem_ipsum_dolores' );
    } );

    it( 'convert_case() to Title_Snake_Case', function()
    {
        expect( strings.convert_case( 'loremIpsumDolores', 'titlesnake' ) ).toEqual( 'Lorem_Ipsum_Dolores' );
    } );

    it( 'convert_case() to SCREAMING_SNAKE', function()
    {
        expect( strings.convert_case( 'loremIpsumDolores', 'screamingsnake' ) ).toEqual( 'LOREM_IPSUM_DOLORES' );
    } );

    it( 'convert_case() to dash-case', function()
    {
        expect( strings.convert_case( 'loremIpsumDolores', 'dash' ) ).toEqual( 'lorem-ipsum-dolores' );
    } );

    it( 'convert_case() to Train-Case', function()
    {
        expect( strings.convert_case( 'loremIpsumDolores', 'train' ) ).toEqual( 'Lorem-Ipsum-Dolores' );
    } );

    it( 'convert_case() to space case', function()
    {
        expect( strings.convert_case( 'loremIpsumDolores', 'space' ) ).toEqual( 'lorem ipsum dolores' );
    } );

    it( 'convert_case() to dot.case', function()
    {
        expect( strings.convert_case( 'loremIpsumDolores', 'dot' ) ).toEqual( 'lorem.ipsum.dolores' );
    } );

    it( 'convert_case() to backslash\\case', function()
    {
        expect( strings.convert_case( 'loremIpsumDolores', 'backslash' ) ).toEqual( 'lorem\\ipsum\\dolores' );
    } );

    it( 'convert_case() to lowercase', function()
    {
        expect( strings.convert_case( 'loremIpsumDolores', 'lower' ) ).toEqual( 'loremipsumdolores' );
    } );

    it( 'convert_case() to UPPERCASE', function()
    {
        expect( strings.convert_case( 'loremIpsumDolores', 'upper' ) ).toEqual( 'LOREMIPSUMDOLORES' );
    } );

    it( 'convert_case() to sTuDLYcApsCasE', function()
    {
        var value = strings.convert_case( 'loremIpsumDolores', 'studlycaps' ).toLowerCase();
        expect( value ).toEqual( 'loremipsumdolores' );
    } );

    it( 'convert_case() to burno', function()
    {
        expect( strings.convert_case( 'loremIpsumDolores', 'burno' ) ).toContain( 'burno' );
    } );

    it( 'to_boolean() with undefined', function()
    {
        expect( strings.to_boolean( undefined ) ).toBeFalsy();
    } );

    it( 'to_boolean() with null', function()
    {
        expect( strings.to_boolean( null ) ).toBeFalsy();
    } );

    it( 'to_boolean() with 0', function()
    {
        expect( strings.to_boolean( 0 ) ).toBeFalsy();
    } );

    it( 'to_boolean() with \'0\'', function()
    {
        expect( strings.to_boolean( '0' ) ).toBeFalsy();
    } );

    it( 'to_boolean() with false', function()
    {
        expect( strings.to_boolean( false ) ).toBeFalsy();
    } );

    it( 'to_boolean() with \'false\'', function()
    {
        expect( strings.to_boolean( 'false' ) ).toBeFalsy();
    } );

    it( 'to_boolean() with \'nop\'', function()
    {
        expect( strings.to_boolean( 'nop' ) ).toBeFalsy();
    } );

    it( 'to_boolean() with \'no\'', function()
    {
        expect( strings.to_boolean( 'no' ) ).toBeFalsy();
    } );

    it( 'to_boolean() with \'nein\'', function()
    {
        expect( strings.to_boolean( 'nein' ) ).toBeFalsy();
    } );

    it( 'to_boolean() with \':(\'', function()
    {
        expect( strings.to_boolean( ':(' ) ).toBeFalsy();
    } );

    it( 'to_boolean() with 1', function()
    {
        expect( strings.to_boolean( 1 ) ).toBeTruthy();
    } );

    it( 'to_boolean() with \'1\'', function()
    {
        expect( strings.to_boolean( '1' ) ).toBeTruthy();
    } );

    it( 'to_boolean() with true', function()
    {
        expect( strings.to_boolean( true ) ).toBeTruthy();
    } );

    it( 'to_boolean() with \'true\'', function()
    {
        expect( strings.to_boolean( 'true' ) ).toBeTruthy();
    } );

    it( 'to_boolean() with \'yes\'', function()
    {
        expect( strings.to_boolean( 'yes' ) ).toBeTruthy();
    } );

    it( 'to_boolean() with \'foo\'', function()
    {
        expect( strings.to_boolean( 'foo' ) ).toBeTruthy();
    } );

    it( 'to_boolean() with \':)\'', function()
    {
        expect( strings.to_boolean( ':)' ) ).toBeTruthy();
    } );

    it( 'trim( \' foo bar \' )', function()
    {
        expect( strings.trim( ' foo bar ' ) ).toEqual( 'foo bar' );
    } );

    it( 'trim( \'-foo bar-\', \'-\' )', function()
    {
        expect( strings.trim( '-foo bar-', '-' ) ).toEqual( 'foo bar' );
    } );

    it( 'trim( \'--_--foo bar__-_-\', \'-_\' )', function()
    {
        expect( strings.trim( '--_--foo bar__-_-', '-_' ) ).toEqual( 'foo bar' );
    } );

    it( 'to_slug( \'Lorem Ipsum Dolores\' )', function()
    {
        expect( strings.to_slug( 'Lorem Ipsum Dolores' ) ).toEqual( 'lorem-ipsum-dolores' );
    } );

    it( 'to_slug( \' Lorem_Ipsum_Dolores \' )', function()
    {
        expect( strings.to_slug( 'Lorem_Ipsum_Dolores' ) ).toEqual( 'lorem_ipsum_dolores' );
    } );

    it( 'to_slug( \'éèôä\' )', function()
    {
        expect( strings.to_slug( 'éèôä' ) ).toEqual( 'eeoa' );
    } );
} );
