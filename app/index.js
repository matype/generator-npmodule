'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

function NpmoduleGenerator (args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({skipInstall: options['skip-install']});
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
}

Npmodule.prototype = new yeoman.generators.Base;

Npmodule.prototype.ask = function () {
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
      name: 'cli',
      message: 'cli tool?: ',
      default: false
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
    this.moduleVarname = this._.camelize(props.moduleName);
    this.cli = props.cli;
    this.description = props.description;
    this.keywords = props.keywords;
    this.github = props.github;
    this.author = props.author;
    this.copyrightName = props.author.replace(/<[^>]*?>/gm, '').trim();
    this.testfw = props.testfw;

    this.dequote = function (str) {
      return str.replace(/\"/gm, '\\"');
    };

    cb();
  }).bind(this);
};

Npmodule.prototype.build = function () {
  this.template('_package.json', 'package.json');
  this.template('readme.markdown', 'readme.markdown');

  if (this.cli) {
    this.mkdir('bin');
    this.copy('cmd.js', 'bin/cmd.js');
  }

  this.copy('_index.js', 'index.js');
  this.copy('gitignore', '.gitignore');
  this.copy('LICENSE', 'LICENSE');
  this.copy('travis.yml', '.travis.yml');

  this.mkdir('test');
  this.template('test.js', 'test/index.js')
};
