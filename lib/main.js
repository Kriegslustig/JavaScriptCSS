var fileHandler = require('./fileHandler.js')
var Parser = require('./parser.js')

module.exports = function main (jsheetsFilePath) {
  var parser
  if(!jsheetsFilePath) return 1
  parser = Object.create(Parser)
  parser.initialize()
  return fileHandler.write(fileHandler.cssFilePath(jsheetsFilePath), parser.parse(fileHandler.read(jsheetsFilePath))) ? 0 : 1
}
