
# Gulp Inject SCSS

Inject Javascript variables as SCSS variables before compiling during a pipe task.

Basically the same principle as [Postilabs](https://github.com/positlabs/inject-scss#readme) Inject SCSS page,
only this variation works within streams/pipes. So you can inject variables directly before your SCSS compilation.

Gulp Inject SCSS also checks wether a given string is a valid CSS unit, and omits any quotations if it should resolve to a unit (i.e. 10px)

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
  'images':'../assets/images/',
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
  background-image:url('../assets/images/wallpaper.jpg');
  max-height:100vh;
}
```
