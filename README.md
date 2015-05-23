# jsheets
## NAME
jsheets - A simple CSS preprocessor that interprets JavaScript

## SYNOPSYS
**jsheets _file_**

## DESCRIPTION
Jsheets is a CSS preprocessor that executes JavaScript. It also replaces function calls and variables inside CSS. A simple approach to CSS preprocessing.

## SYNTAX

### The `$` Object
Inside CSS the whole `$` object is availible to you. That's it.

```
div {
  background: $.someColor;
}
```

### `import`
With `import` you can import files to a jsheet. Its usage is straight forward:

```
import 'somefile.jsheet'
```

### `css()`
With the `css` function you can output css. So you can do:

```
css('div {display: block}')
```

### Variable Scope
Every file has it's own local scope. But the `$`-object is global.

### helpers
Because underscore is used in the project, I thought i'd pass it to the jsheets. There are also some helpers provided inside the `$` object.

#### $
`$.$` is a function that executes and returns what is passed to it. So for example:

```
div {
  width: $.$(100 * 30)px
}
```

You cannot use braces inside of a call to `$.$`. That's because the `$` variables and functions are replaced using a mediocar RegEx.

## ROADMAP
I'm pretty ok with the package as it stands right now. But there are a lot of things I plan to implement.

* Globbing
* Integration
  * express
  * meteor
* Highlighting
  * SublimeText