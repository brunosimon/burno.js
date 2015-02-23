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
        paths.sources + 'libs/polyfills/classlist.js',
        paths.sources + 'libs/polyfills/foreach.js',
        paths.sources + 'libs/polyfills/indexof.js',
        paths.sources + 'libs/polyfills/requestanimationframe.js',
        paths.sources + 'libs/polyfills/object-keys.js',
        paths.sources + 'libs/class.js',
        paths.sources + 'app/core/b.class.js',
        paths.sources + 'app/core/abstract.class.js',
        paths.sources + 'app/core/event_emitter.class.js',
        paths.sources + 'app/tools/mouse.class.js',
        paths.sources + 'app/tools/keyboard.class.js',
        paths.sources + 'app/tools/browser.class.js',
        paths.sources + 'app/tools/css.class.js',
        paths.sources + 'app/tools/images.class.js',
        paths.sources + 'app/tools/ticker.class.js',
        paths.sources + 'app/tools/navigation.class.js',
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
