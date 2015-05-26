jsheets(1)
======

`v0.3.0` - A simple CSS preprocessor that interprets JavaScript

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

Inside CSS the whole `$` object is availible to you. Because `$` is also a function (as explained in the helpers section), you can't write to its `arguments`, `caller`, `length` and `prototype` attributes.

```
div {
  background: $.someColor;
}
```

### include

`include '`_file/directory_`'`

With `include` you can import files or directories to a jsheet. When you include a directory, it will search that directory for files with the `jsheet` file extension.

### css()

`css(`_string_`)`

With the `css` function you can output css. So you can do:

```
css('div {display: block}')
```

### Variable Scope
All combined files have the same global scope.

### Globals
Inside your JavaScript you have the following variables availible to you.

#### _

[The underscore library](0.1.0)

#### require

[The nodejs require function](https://nodejs.org/api/globals.html#globals_require)

#### css

As documented above

#### hooks

Documented in the `hooks section`

#### on

`on(`_hook_`, `_function_`)`

`on` is the function to add functions to hooks. See under the hooks section for examples.

### helpers
There are some helpers provided inside the `$` object.

#### $

`$(`_expression_`)`

`$` itself is not just an object but also a function that executes and returns what is passed to it. This can be usefull for math or sometimes you can use it to use variables in weird places. Example:

```
div {
  width: $(100 * 30)px
  /* WON'T WORK */
  width: $.someWithem
  /* WILL WORK */
  width: $($.someWith)em
}
```

You cannot use braces inside of a call to `$`. That's because the `$` variables and functions are replaced using a mediocar RegEx.

#### extend

`extend.add(`_name_`, `_attributes_`)`

`extend.that(`_name_`, `_selector_`)`

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

#### calc

`$.calc(`_calculation_`)`

With calc you can do calculations in css units. You pass it a string. It also does a printf-style replacement with `%d`.

```
$.someVar = '4rem'
$.calc('%d / 2', $.someVar)
```

compilesTo
```
2rem
```

### Hooks

In _jsheets_ hooks are simple arrays you can push functions to. They are stored in the hooks object, which is globally availible. Hooks get triggered at a certain point in the parsing process and then the functions stored in a hook array will get executed with certain parameters.

#### onEOF

These hooks are executed without an argument, at the and of parsing a file. The return value of a `onEOF` hook will get printed as CSS.

#### Extensions

Extending _jsheets_ is super straigt forward. If you want to add your own helpers, you can just add stuff to the `object`.

```
$.myHelper = function () {
  css('before: "YEY! I wrote my own helper :OO"')
}
```

You can also install and require npm modules. Autoprefixer for example

```
npm install autoprefixer
```

```
on('onEOF', require('autoprefixer'))
```


#### onAfterParse

`onAfterParse` hooks are the last thing that gets called. They receive the parsed CSS as an argument. Their return value replaces the parsed CSS. This makes it perfect for something like autoprefixer.

ROADMAP
-------

I'm pretty ok with the package as it stands right now. But there are a lot of things I plan to implement.

* Integration
  * express
  * meteor
* Highlighting
  * SublimeText

TODO
----

* Fix the onAfterParse hook to only execute once

Changelog - `v0.3.0`
-------

**This is still an early alpha, so everything can change**

* Added this file (changelog)
* Rewrote the hooks interface
* All files have the same global scope now
* Fixed my version numbers (again) #fubar
