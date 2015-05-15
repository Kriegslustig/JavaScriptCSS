var assert = require('assert')
var fileHandler = require('../lib/fileHandler.js')
var fs = require('fs')

describe('fileHandler', function () {
  var testFile = './test.txt'
  var testString = 'asdf'

  describe('read', function () {
    var fileStream = fs.openSync(testFile, 'w')
    fs.writeSync(fileStream, testString)
    fs.closeSync(fileStream)
    it('should return the contents of a file as a string', function () {
      assert.equal(testString, fileHandler.read(testFile))
    })
    it('should return false if the file doesn\'t exsist', function () {
      assert.equal(false, fileHandler.read('./gabeldigu'))
    })
    after(function () {
      fs.unlink(testFile)
    })
  })

  describe('write', function () {
    before(function () {
      fileHandler.write(testFile, testString)
    })
    it('Should create the file if it doesn\'t exsist', function () {
      assert.equal(true, fs.existsSync(testFile))
    })
    it('Should write the first argument to the file', function () {
      assert.equal(testString, fs.readFileSync(testFile, {encoding: 'utf8'}))
    })
    after(function () {
      fs.unlink(testFile)
    })
  })
})
