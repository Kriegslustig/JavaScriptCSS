var fileHandler = require('./lib/fileHandler.js')
var parser = require('./lib/parser.js')

function main (jcssFilePath) {
  if(!jcssFilePath) return 1
  return fileHandler.write(fileHandler.cssFilePath(jcssFilePath), parser.parse(fileHandler.read(jcssFilePath))) ? 0 : 1
}

module.exports = main
