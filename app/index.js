'use strict';

var util = require('util');
var path = require('path');
var mkdirp = require('mkdirp');
var yeoman = require('yeoman-generator');
var gitconfig = require('git-config');

module.exports = NpmoduleGenerator;

function NpmoduleGenerator (args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({skipInstall: options['skip-install']});
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
}

util.inherits(NpmoduleGenerator, yeoman.generators.Base);

NpmoduleGenerator.prototype.ask = function () {
  var cb = this.async();

  console.log(this.yeoman);

  var config = gitconfig.sync();

  var prompts = [
    {
      type: 'input',
      name: 'moduleName',
      message: 'module name: ',
      default: path.basename(process.cwd())
    },
    {
      type: 'input',
      name: 'description',
      message: 'module description: ',
    },
    {
      type: 'confirm',
      name: 'cmd',
      message: 'command line tool?: ',
      default: true
    },
    {
      type: 'input',
      name: 'keywords',
      message: 'keywords: ',
      filter:
        function (val) {
          return val.split(',').map(function (v) {
            return v.trim();
          }).filter(function (v) {
            return v.length > 0;
          })
        }
    },
    {
      type: 'input',
      name: 'github',
      message: 'github username: ',
      default: (config.github && config.github.user) || ''
    },
    {
      type: 'input',
      name: 'author',
      message: 'author name: ',
      default: (config.user && config.user.name) || ''
    }
  ];

  this.prompt(prompts, function (props) {
    this.moduleName = this._.slugify(props.moduleName);
    this.moduleVarName = this._.camelize(props.moduleName);
    this.cmd = props.cmd;
    this.description = props.description;
    this.keywords = props.keywords;
    this.github = props.github;
    this.author = props.author;
    this.copyrightName = props.author.replace(/<[^>]*?>/gm, '').trim();

    this.dequote = function (str) {
      return str.replace(/\"/gm, '\\"');
    };

    cb();
  }.bind(this));
};

NpmoduleGenerator.prototype.build = function () {
  mkdirp('test', function (err) {
    if (err) throw err;
  });

  this.template('_package.json', 'package.json');
  this.template('readme.markdown', 'README.md');
  this.template('changelog.markdown', 'CHANGELOG.md');
  this.template('test.js', 'test/index.js')

  if (this.cmd) {
    this.copy('cli.js', 'cli.js');
  }

  this.copy('_index.js', 'index.js');
  this.copy('gitignore', '.gitignore');
  this.copy('editorconfig', '.editorconfig');
  this.copy('travis.yml', '.travis.yml');
  this.copy('LICENSE', 'LICENSE');
};
