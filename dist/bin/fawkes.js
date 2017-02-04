#!/usr/bin/env node
"use strict";
var program = require("commander");
var fawkes_1 = require("../lib/fawkes");
require('ts-node/register');
program
    .version('0.0.1')
    .option('-s, --swagger [value]', 'generate swagger document location');
program.parse(process.argv);
if (program.swagger) {
    fawkes_1.Fawkes.generateSwagger(program.swagger);
}
