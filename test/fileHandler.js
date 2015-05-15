var assert = require('assert')
var fileHandler = require('../lib/fileHandler')
var fs = require('fs')

describe('fileHandler', function () {
  var testFile = './test.txt'
  var testString = 'asdf'
  describe('read', function () {
    var fileStream = fs.openSync(testFile, 'w')
    fs.writeSync(fileStream, testString)
    it('should return the contents of a file as a string', function () {
      assert.equal(testString, fileHandler.read(testFile))
    })
    it('should return false if the file doesn\'t exsist', function () {
      assert.equal(false, fileHandler.read('./gabeldigu'))
    })
    fs.closeSync(fileStream)
    fs.unlink(testFile)
  })
})