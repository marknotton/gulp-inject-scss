


# Gulp Inject SCSS

Inject Javascript arrays to render SCSS variables or imports during a pipe task.

Basically the same principle as [Postilabs](https://github.com/positlabs/inject-scss#readme) Inject SCSS page, only this variation works within streams/pipes. So you can inject variables or imports directly before your SCSS compilation.

So you could use this to respect environment paths that differ between development and production servers for example. Or keep unit sizes consistent between Javascript and CSS. Or maybe you just need to define a special custom property bespoke to your needs.

### Installation
```
npm i gulp-inject-scss --save
```
### Setup
```
const injectScss = require('gulp-inject-scss')
```
## Injecting Variables

Pass an associative array where the keys are the css properties and the values are the css values.

```js
gulp.task('sass', () => {

  let variables = {
   'images':'"../assets/images/"',
   'max-height':'100vh',
   'browser-version':11
  }

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
### Sass Maps
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

The following won't actually be rendered anywhere for you to see. It's done entirely dynamically. This is just an idea of what becomes available to you within your scss development.

```css
$themes : (
  primary : '#FFF8DC',
  secondary : '#EFF0F1'
);
```

## Injecting Imports

Pass an array of strings and render each one as an css @import.

```js
gulp.task('sass', () => {

  let imports = {
   'vendor/marknotton/doggistyle/dist/_doggistyle.scss',
   'settings/_symbols.scss'
  }

  return gulp.src(config.sources.sass)
  .pipe(injectScss(imports))
  .pipe(gulpsass({outputStyle: 'compressed'}))
  .pipe(gulp.dest("cssfile.css"))
});
```
### SCSS

The following won't actually be rendered anywhere for you to see. It's done entirely dynamically. This is just an idea of what becomes available to you within your scss development.
```css
@import 'vendor/marknotton/doggistyle/dist/_doggistyle';
@import 'settings/_symbols.scss';
```
## Injecting both Variables and Imports

To use both injection methods, you can simply include both array types in any order.
```js
.pipe(injectScss(imports, variables))
```
