// Modules
var gulp   = require( 'gulp' ),
    concat = require( 'gulp-concat' ),
    uglify = require( 'gulp-uglify' ),
    watch  = require( 'gulp-watch' ),
    rename = require( 'gulp-rename' );

// Options
var options =
{
    version : '0.1',
    paths   :
    {
        sources     : '../src/',
        destination : '../build/'
    }
};

/**
 * JS
 */
gulp.task( 'js', function()
{
    gulp.src( [
        options.paths.sources + 'polyfills/classlist.js',
        options.paths.sources + 'polyfills/foreach.js',
        options.paths.sources + 'polyfills/getcomputedstyle.js',
        options.paths.sources + 'polyfills/indexof.js',
        options.paths.sources + 'polyfills/object-keys.js',
        options.paths.sources + 'polyfills/object-create.js',
        options.paths.sources + 'polyfills/requestanimationframe.js',

        options.paths.sources + 'core/b.class.js',
        options.paths.sources + 'core/abstract.class.js',
        options.paths.sources + 'core/event_emitter.class.js',

        options.paths.sources + 'tools/browser.class.js',
        options.paths.sources + 'tools/colors.class.js',
        options.paths.sources + 'tools/css.class.js',
        options.paths.sources + 'tools/ga_tags.class.js',
        options.paths.sources + 'tools/keyboard.class.js',
        options.paths.sources + 'tools/mouse.class.js',
        options.paths.sources + 'tools/offline.class.js',
        options.paths.sources + 'tools/registry.class.js',
        options.paths.sources + 'tools/resizer.class.js',
        options.paths.sources + 'tools/ticker.class.js',
    ] )
    .pipe( concat( 'burno-' + options.version + '.js' ) )
    .pipe( gulp.dest( options.paths.destination ) )
    .pipe( uglify() )
    .pipe( rename( { extname : '.min.js' } ) )
    .pipe( gulp.dest( options.paths.destination ) );
} );

/**
 * WATCH
 */
gulp.task( 'watch', [ 'js' ], function()
{
    // JS
    watch( [ options.paths.sources + 'js/**' ], function()
    {
        gulp.start( 'js' );
    } );
} );

gulp.task( 'default', [ 'js' ] );
