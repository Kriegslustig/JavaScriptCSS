var fs = require('fs')

module.exports = {
  read: function (filePath) {
    if(!fs.existsSync(filePath)) return false
    return fs.readFileSync(filePath, {encoding: 'utf8'})
  }
}
