var fileHandler = require('./fileHandler.js')
var parser = new (require('./parser.js'))

module.exports = function main (jsheetsFilePath) {
  if(!jsheetsFilePath) return 1
  return fileHandler.write(fileHandler.cssFilePath(jsheetsFilePath), parser.parse(fileHandler.read(jsheetsFilePath))) ? 0 : 1
}
