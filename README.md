
# Gulp Inject SCSS

Inject Javascript variables as SCSS variables before compiling during a pipe task.

Basically the same principle as [Postilabs](https://github.com/positlabs/inject-scss#readme) Inject SCSS page,
only this variation works within streams/pipes. So you can inject variables directly before your SCSS compilation.

So you could use this to respect environment paths that differ between development and production servers for example. Or keep unit sizes consistent between Javascript and CSS. Or maybe you just need to define a special custom property bespoke to your needs.

### Installation
```
npm i gulp-inject-scss --save
```
### Setup
```
const injectScss = require('gulp-inject-scss')
```
### Usage

```js

const gulpsass    = require('gulp-sass'),
      injectScss  = require('gulp-inject-scss');

let variables = {
  'images':'"../assets/images/"',
  'max-height':'100vh',
  'browser-version':11,
}

gulp.task('sass', () => {
  return gulp.src(config.sources.sass)
  .pipe(injectScss(variables))
  .pipe(gulpsass({outputStyle: 'compressed'}))
  .pipe(gulp.dest("cssfile.css"))
});
```

### SCSS input
```css
:root { --browser-version : #{$browser-version}; }
body {
  background-image:url(#{$images} + 'wallpaper.jpg');
  max-height:#{$max-height};
}
```

### CSS output
```css
:root { --browser-version : 11; }
body {
  background-image:url(../assets/images/wallpaper.jpg);
  max-height:100vh;
}
```
### Bonus feature
You can also pass in nested objects, which will resolve to a Sass Map.

```js

let variables = {
  'images':'"../assets/images/"',
  'max-height':'100vh',
  'browser-version':11,
  'themes' : {
    'primary' : '#FFF8DC',
    'secondary' : '#EFF0F1'
  }
}
```

### SCSS

```css
$images : (
  primary : '#FFF8DC',
  secondary : '#EFF0F1'
);
```

Remember, this map and other variables are not stored into a file that you can read with your eyes. It's entirely dynamic.
