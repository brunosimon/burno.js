var gulp   = require( 'gulp' ),
    concat = require( 'gulp-concat' ),
    uglify = require( 'gulp-uglify' ),
    watch  = require( 'gulp-watch' ),
    rename = require( 'gulp-rename' );

var paths =
{
    sources     : '../src/',
    destination : '../build/'
};

/**
 * JS
 */
gulp.task( 'js', function()
{
    gulp.src([
        paths.sources + 'polyfills/classlist.js',
        paths.sources + 'polyfills/foreach.js',
        paths.sources + 'polyfills/getcomputedstyle.js',
        paths.sources + 'polyfills/indexof.js',
        paths.sources + 'polyfills/object-keys.js',
        paths.sources + 'polyfills/requestanimationframe.js',

        paths.sources + 'core/b.class.js',
        paths.sources + 'core/abstract.class.js',
        paths.sources + 'core/event_emitter.class.js',

        paths.sources + 'tools/browser.class.js',
        paths.sources + 'tools/colors.class.js',
        paths.sources + 'tools/css.class.js',
        paths.sources + 'tools/ga_tags.class.js',
        paths.sources + 'tools/keyboard.class.js',
        paths.sources + 'tools/mouse.class.js',
        paths.sources + 'tools/offline.class.js',
        paths.sources + 'tools/registry.class.js',
        paths.sources + 'tools/resizer.class.js',
        paths.sources + 'tools/ticker.class.js',
    ])
    .pipe( concat( 'burno.js' ) )
    .pipe( gulp.dest( paths.destination ) )
    .pipe( uglify() )
    .pipe(rename( { extname: '.min.js' } ) )
    .pipe( gulp.dest( paths.destination ) );
} );

/**
 * WATCH
 */
gulp.task( 'watch', [ 'js' ], function()
{
    // JS
    watch( [ paths.sources + 'js/**' ], function()
    {
        gulp.start( 'js' );
    } );

} );

gulp.task( 'default', [ 'js' ] );
