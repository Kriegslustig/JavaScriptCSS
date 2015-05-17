var _ = require('underscore')
var fs = require('fs')

module.exports = {
  read: function (filePath) {
    if(!fs.existsSync(filePath)) return false
    return fs.readFileSync(filePath, {encoding: 'utf8'})
  },

  write: function (filePath, data) {
    if(!(filePath && data)) return false
    return (fs.writeFileSync(filePath, data) == undefined && true)
  },

  cssFilePath: function (filePath) {
    var self = this
    var basePathSplit = self.splitBasePath(filePath)
    return [basePathSplit[0], self.setFileExt(basePathSplit[1], 'css')].join('')
  },

  splitBasePath: function (filePath) {
    var pathSplit = filePath.split('/')
    if(filePath.indexOf('/') < 0) return ['', filePath]
    return [
      (
        pathSplit.length > 1 ?
        _.rest(pathSplit.reverse()).reverse().join('/') + '/' :
        filePath
      )
      , _.last(pathSplit.reverse())
    ]
  },

  setFileExt: function (fileName, extension) {
    var fileNameSplit = fileName.split('.')
    return (
        fileNameSplit.length > 1 ?
        _.rest(fileNameSplit.reverse()).reverse() :
        [fileName]
      ).concat(extension).join('.')
  }
}
