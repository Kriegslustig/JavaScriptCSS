var assert = require('assert')
var fs = require('fs')

var main = require('../jcss.js')

describe('main', function () {
  it('should take require at least one arguments', function () {
    assert.equal(1, main())
  })
  it('should throw an error if the first argument is not a file', function () {
    assert.equal(1, main('notafile'))
  })
  it('should create the file passed as the second argument.', function () {
    var testFileName = 'testFile'
    var testString = 'div {display: block;}'
    function deleteTestFiles () {
      fs.unlink(testFileName + '.css')
      fs.unlink(testFileName + '.jcss')
    }
    fs.writeFile(testFileName + '.jcss', testString, function () {
      main(testFileName + '.jcss')
      fs.readdir('./', function (err, dir) {
        assert.ok(dir.indexOf(testFileName + '.css') > -1)
        deleteTestFiles()
      })
    })
  })
})