'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;

describe('npmodule generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) return done(err);

      this.app = helpers.createGenerator('npmodule:app', ['../../app']);

      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'index.js',
      '.gitignore',
      '.travis.yml',
      '.editorconfig',
      'README.md',
      'CHANGELOG.md',
      'LICENSE',
      'test/index.js',
      'cli.js',
      'package.json'
    ];

    helpers.mockPrompt(this.app, {
      'moduleName': 'mymodule',
      'description': 'sugoi module',
      'keywords': 'sugoi',
      'cmd': true,
      'github': 'morishitter',
      'author': 'Masaaki Morishita'
    });

    this.app.options['skip-install'] = true;

    this.app.run({}, function () {
      expected.forEach(function (file) {
        helpers.assertFile(file);
      });
      done();
    });
  });
});
