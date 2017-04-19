#!/usr/bin/env node
"use strict";
var program = require("commander");
require("ts-node/register");
var fawkes_1 = require("../lib/fawkes");
program
    .version("0.0.1")
    .option("-s, --swagger [value]", "generate swagger document location");
program.parse(process.argv);
if (program.swagger) {
    fawkes_1.Fawkes.generateSwaggerAsync(program.swagger)
        .then(function (tmp) {
        // tslint:disable-next-line no-console
        console.log(tmp);
    })
        .catch(function (err) {
        // tslint:disable-next-line no-console
        console.log(err);
    });
}
