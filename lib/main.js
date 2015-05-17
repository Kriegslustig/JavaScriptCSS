var fileHandler = require('./fileHandler.js')
var parser = require('./parser.js')

module.exports = function main (jcssFilePath) {
  if(!jcssFilePath) return 1
  return fileHandler.write(fileHandler.cssFilePath(jcssFilePath), parser.parse(fileHandler.read(jcssFilePath))) ? 0 : 1
}
