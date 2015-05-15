var assert = require('assert')
var fileHandler = require('fileHandler')
var fs = require('fs')

describe('fileHandler', function () {
  var testFile = './test.txt'
  var testString = 'asdf'
  describe('read', function () {
    fs.open(testFile, 'w', function (err, fd) {
      fs.write(fd, testString, function (err) {
        it('should return the contents of a file as a string', function () {
          assert.equal(testString, fileHandler.read(testFile))
        })
        it('should return false if the file doesn\'t exsist', function () {
          assert.equal(false, fileHandler.read('./gabeldigu'))
        })
        fs.close(fd, function () {
          fs.unlink(testFile)
        })
      })
    })
  })
})