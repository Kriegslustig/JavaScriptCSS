var fileHandler = require('./fileHandler.js')
var parser = require('./parser.js')

module.exports = function main (jsheetFilePath) {
  if(!jsheetFilePath) return 1
  return fileHandler.write(fileHandler.cssFilePath(jsheetFilePath), parser.parse(fileHandler.read(jsheetFilePath))) ? 0 : 1
}
