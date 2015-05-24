#!/usr/bin/env node

var main = require('./lib/main.js')
var fileHandler = require('./lib/fileHandler.js')
var parser = require('./lib/parser.js')

if(process.argv.length > 2) {
  main(process.argv[2])
}
