# Inject SCSS

![Made For NPM](https://img.shields.io/badge/Made%20for-NPM-orange.svg) ![Made For Gulp](https://img.shields.io/badge/Made%20for-Gulp-red.svg)

Inject Javascript variables into your SASS/SCSS during the Gulp task within pipes..

## Installation
```
npm i @marknotton/inject-scss --save-dev
```
```js
const injectScss = require('@marknotton/inject-scss')
```

Basically this uses the same principle as [Postilabs](https://github.com/positlabs/inject-scss#readme) Inject SCSS project, only this variation works within Gulp pipes. So you can inject variables or imports directly before your SCSS compilation.

You could use this to respect asset paths that differ between development and production environments for example. Or keep unit sizes consistent between Javascript and CSS. Or maybe you just need to define a special custom property bespoke to your needs.

## Injecting Variables

Pass an associative array where the keys are the css properties and the values are the css values.

```js
gulp.task('sass', () => {

  let variables = {
   'images':'"../assets/images/"',
   'max-height':'100vh',
   'browser-version':11
  }

  return gulp.src('*/**.scss')
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
## Maps
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

### Virtual SCSS output

Maps won't actually be rendered anywhere in your scss files. It's all done dynamically during a Gulp task. However, this is essentially what a map might function like during the process:

```css
$themes : (
  primary : '#FFF8DC',
  secondary : '#EFF0F1'
);
```

## Injecting Imports

Pass an array of strings (as-apposed to an object like above) to render each string as an css @import.

```js
gulp.task('sass', () => {

  let imports = {
   'vendor/marknotton/doggistyle/dist/_doggistyle.scss',
   'settings/_symbols.scss'
  }

  return gulp.src('*/**.scss')
  .pipe(injectScss(imports))
  .pipe(gulpsass({outputStyle: 'compressed'}))
  .pipe(gulp.dest("cssfile.css"))
});
```
### Virtual SCSS output

Imports won't actually be rendered anywhere in your scss files. It's all done dynamically during a Gulp task. However, this is essentially what the imports might function like during the process:

```css
@import 'vendor/marknotton/doggistyle/dist/_doggistyle';
@import 'settings/_symbols.scss';
```

## Injecting both Variables and Imports

To use both injection methods, you can simply include an array for imports and an object for variables in any order.
```js
.pipe(injectScss(imports, variables))
```
