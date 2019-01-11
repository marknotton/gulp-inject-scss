
# Inject SCSS

![Made For NPM](https://img.shields.io/badge/Made%20for-NPM-orange.svg) ![Made For Gulp](https://img.shields.io/badge/Made%20for-Gulp-red.svg)

Inject Javascript variables and imports Globs into your SASS/SCSS during the Gulp task within pipes.

## Installation
```
npm i @marknotton/inject-scss --save-dev
```
```js
const injectScss = require('@marknotton/inject-scss')
```

Basically this uses the same principle as [Postilabs](https://github.com/positlabs/inject-scss#readme) Inject SCSS project, only this variation works within Gulp pipes. So you can inject variables or imports directly before your SCSS compilation.

You could use this to inject asset paths that differ between development and production environments for example. Or keep unit sizes or other variables consistent between Javascript and CSS. Or maybe you just need to define a special custom property bespoke to your project. You can also refer to Globs when importing files, which means you can eliminate the need to import all your modular css files at the start of your scss and have them automatically inject everything.

## Injecting Variables

Pass an associative array where the keys are the css properties and the values are the css values.

```js
gulp.task('sass', () => {

  let settings = {
	  variables = {
	   'images':'"../assets/images/"',
	   'max-height':'100vh',
	   'browser-version':11
	  }
  }

  return gulp.src('*/**.scss')
  .pipe(injectScss(settings))
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

let settings = {
  variables = {
    'images':'"../assets/images/"',
    'max-height':'100vh',
    'browser-version':11,
    'themes' : {
      'primary' : '#FFF8DC',
      'secondary' : '#EFF0F1'
    }
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

Pass an array of strings (as-apposed to an object like above) to render each string as an css @import. The example below will grab all scss files that are prefixed with an underscore. Paths that have no Glob syntax (like ! or *) will be added to the import array regardless of wether the file exists. This is intended to give you better control of files that aren't matched in the glob.  **Paths starting with a hat character (^) will be rendered at the end of your file.**

Passing 'true' will log out the debug of the imports and variables. Showing you what's actually being included.

```js
gulp.task('sass', () => {

  let setttings = {
    imports = {
      'vendor/marknotton/doggistyle/dist/_doggistyle.scss',
      'settings',
      '^src/sass/**/(_)*.scss'
    }
  }

  return gulp.src('*/**.scss')
  .pipe(injectScss(setttings))
  .pipe(gulpsass({outputStyle: 'compressed'}))
  .pipe(gulp.dest("cssfile.css"))
});
```
### Virtual SCSS output

Imports won't actually be rendered anywhere in your scss files. It's all done dynamically during a Gulp task. However, this is essentially what the imports might function like during the process. Notice how the paths are relative to the sass file, and not the absolute directory tree.

```css
@import 'vendor/marknotton/doggistyle/dist/_doggistyle',
'settings';

/* All your other CSS */

@import 'pages/home',
'pages/news',
'components/gallery/images';
```

## Injecting both Variables and Imports

To use both injection methods, you can simply include an array for imports and an object for variables in any order.
```js
.pipe(injectScss({ variables : {...}, imports : {...} ))
```
## Debug
Passing a `true` will render out some additional data to help you see what's actually being injected
```js
.pipe(injectScss({ variables : {...}, imports : {...} ), true)
```
## Special Files
The settings object should include a 'variables' and 'imports' key to inject their respective options. These are global for all files that get rendered out. But you can also merge in a special set of options bespoke to a particular file. If the sass file in the stream matches the nested key name, then the additional variables/imports will be merged into the global variables/imports too.
```js
.pipe(injectScss({
  variables : {...},
  imports : {...},
  emailer : { variables : {
    'max-width' : '600px'
  }}
 })
```
