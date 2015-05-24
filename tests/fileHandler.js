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
    it('Should return false if any of the arguments is false', function () {
      assert.equal(false, fileHandler.write(false, ' '))
      assert.equal(false, fileHandler.write(' ', false))
    })
    after(function () {
      fs.unlink(testFile)
    })
  })

  describe('cssFilePath', function () {
    it('should replace the file extesion with css', function () {
      assert.equal('someFile.css', fileHandler.cssFilePath('someFile.jsheet'))
    })
    it('should add an extension if there isn\'t one', function () {
      assert.equal('asdf/somefile.css', fileHandler.cssFilePath('asdf/somefile'))
    })
    it('should be able to handle dots in filenames', function () {
      assert.equal('foo.bar.css', fileHandler.cssFilePath('foo.bar.jsheet'))
    })
  })

  describe('splitBasePath', function () {
    it('should return and array with the start and the last file or directory name in a filepath', function () {
      var testSplit = fileHandler.splitBasePath('/foo/bar/yolo/troll')
      assert.equal('object', typeof testSplit)
      assert.equal('/foo/bar/yolo/', testSplit[0])
      assert.equal('troll', testSplit[1])
    })
    it('should return an empty string and the passed value if it has no slashes', function () {
      var testSplit = fileHandler.splitBasePath('yolo.42')
      assert.equal('', testSplit[0])
      assert.equal('yolo.42', testSplit[1])
    })
  })

  describe('setFileExt', function () {
    it('should just set the file extension if it has none', function () {
      assert.equal('somefile.css', fileHandler.setFileExt('somefile', 'css'))
    })
    it('should replace the file extension if there alreay is one', function () {
      assert.equal('some_file.css', fileHandler.setFileExt('some_file.jsheet', 'css'))
    })
    it('should be able to handle dots in filenames', function () {
      assert.equal('yolo.42.txt', fileHandler.setFileExt('yolo.42.xml', 'txt'))
    })
  })

  describe('getJsheets', function () {
    var testDirectory = './test'
    var testFile = testDirectory + '/testfile.jsheet'
    var testFile2 = testDirectory + '/testfile2.jsheet'
    var testFile3 = testDirectory + '/testfile2.css'
    before(function () {
      fs.mkdirSync(testDirectory)
      fs.writeFileSync(testFile, ' ')
      fs.writeFileSync(testFile2, ' ')
      fs.writeFileSync(testFile3, ' ')
    })
    it('should return an array', function () {
      assert.equal('object', typeof fileHandler.getJsheets(testFile))
    })
    it('should return paths to all jsheets in a directory', function () {
      var jsheets = fileHandler.getJsheets(testDirectory)
      assert.ok(jsheets.indexOf(testFile) > -1)
      assert.ok(jsheets.indexOf(testFile2) > -1)
    })
    it('should ignore other files in the directory', function () {
      var jsheets = fileHandler.getJsheets(testDirectory)
      assert.ok(jsheets.indexOf(testFile3) === -1)
    })
    after(function () {
      fs.unlinkSync(testFile)
      fs.unlinkSync(testFile2)
      fs.unlinkSync(testFile3)
      fs.rmdirSync(testDirectory)
    })
  })
})
