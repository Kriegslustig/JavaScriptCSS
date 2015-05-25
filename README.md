jsheets(1)
======

`v0.0.2` - A simple CSS preprocessor that interprets JavaScript

SYNOPSYS
-------

**jsheets _file_**

DESCRIPTION
----------

Jsheets is a CSS preprocessor that executes JavaScript. It also replaces function calls and variables inside CSS. A simple approach to CSS preprocessing.

INSTALL
------

```
npm install -g jsheets
```

SYNTAX
------

### The `$` Object
Inside CSS the whole `$` object is availible to you. That's it.

```
div {
  background: $.someColor;
}
```

### `include`
With `include` you can import files or directories to a jsheet. When you include a directory, it will search that directory for files with the `jsheet` file extension. Its usage is straight forward:

```
include 'somefile.jsheet'
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
`$.$` is a function that executes and returns what is passed to it. This can be usefull for math or sometimes you can use it to use variables in weird places. Example:

```
div {
  width: $.$(100 * 30)px
  /* WON'T WORK */
  width: $.someWithem
  /* WILL WORK */
  width: $.$($.someWith)em
}
```

#### extend
With `extend` you can reuse css attributes. It has two methods: `add` and `that`. With add you create save a bunch of attributes under a name.

```
$.extend.add('roundbutton', '\
  display: block;'
)
```

Then with `extend.that` you can then reuse those attributes.

```
$.extend.that('roundbutton', '.dialogue__button')
$.extend.that('roundbutton', '.escape__button')
```

What is special about this function, is that it renders only one CSS block per `extend.add`. So the above renders to:

```
roundbutton, .dialogue__button, .escape__button {  display: block; }
```

#### onDone
On done is an array you can push functions to that get executed at the and of parsing a file. The return value of a onDone hook will get printed as CSS.

You cannot use braces inside of a call to `$.$`. That's because the `$` variables and functions are replaced using a mediocar RegEx.

#### calc
With calc you can do calculations in css units. You pass it a string. It also does a printf-style replacement with `%d`.

```
$.someVar = '4rem'
$.calc('%d / 2', $.someVar)
```

compilesTo
```
2rem
```

ROADMAP
-------

I'm pretty ok with the package as it stands right now. But there are a lot of things I plan to implement.

* Integration
  * express
  * meteor
* Highlighting
  * SublimeText