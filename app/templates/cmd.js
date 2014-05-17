#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var pkg = require('../package.json');
var <%= moduleVarName %> = require('..');


program.version(pkg.version)

program.parse(process.argv)
