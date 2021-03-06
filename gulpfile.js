var gulp      = require('gulp');
var transform = require('vinyl-transform');
var pkg       = require('./package.json');

var config = {
  scripts: ['public/js/*.js', 'public/data/*.js', 'public/js/**/*.js', 'public/js/**/**/*.js']
};

config.lint = config.scripts.concat(['*.js', 'test/*.js']);

gulp.task( 'connect', function(){
  require('gulp-connect').server({
    root: 'public'
  });
});

gulp.task( 'scripts', function(){
  return gulp.src('./public/js/app.js')
  .pipe( transform( function( filename ){
    return require('browserify')({
      debug: true
    })
    .add( filename )
    .bundle();
  }))
  .pipe( gulp.dest('public/dist') );
});

gulp.task( 'less', function(){
  return gulp.src('less/app.less')
    .pipe( require('gulp-less')() )
    .pipe( gulp.dest('public/dist') );
});

gulp.task( 'lint', function(){
  return gulp.src( config.lint )
    .pipe( require('gulp-jshint')( pkg.jshint || {} ) )
    .pipe( require('gulp-jshint').reporter('default') );
});

gulp.task( 'watch', function(){
  gulp.watch( config.lint, ['lint'] );
  gulp.watch( config.scripts, ['scripts'] );
  gulp.watch( ['less/*.less', 'less/**/*.less'], ['less'] );
});

gulp.task( 'default', [ 'less', 'lint', 'scripts', 'connect', 'watch'] );