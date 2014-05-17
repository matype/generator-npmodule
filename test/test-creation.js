'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;

describe('npmodule generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('npmodule:app', [
        '../../app'
      ], [], {'skip-install': true});
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'index.js',
      '.gitignore',
      '.travis.yml',
      'readme.markdown',
      'LICENSE',
      'test/index.js',
      'bin/cmd.js',
      ['package.json', /"name": "mymodule"/]
    ];

    helpers.mockPrompt(this.app, {
      'moduleName': 'mymodule',
      'description': 'sugoi module',
      'keywords': 'sugoi',
      'cli': true,
      'githu': 'morishitter',
      'author': 'Masaaki Morishita'
    });

    // this.app.options['skip-install'] = true;

    this.app.run({}, function () {
      expected.forEach(function (file) {
        if (typeof file === 'string') {
          helpers.assertFile(file);
        } else if (Array.isArray(file)) {
          helpers.assertFileContent(file[0], file[1]);
        }
      });
      done();
    });
  });
});
