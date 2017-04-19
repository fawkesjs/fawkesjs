#!/usr/bin/env node
import * as program from "commander";
import "ts-node/register";
import { Fawkes } from "../lib/fawkes";
program
  .version("0.0.1")
  .option("-s, --swagger [value]", "generate swagger document location");
program.parse(process.argv);
if (program.swagger) {
  Fawkes.generateSwaggerAsync(program.swagger)
    .then((tmp) => {
      // tslint:disable-next-line no-console
      console.log(tmp);
    })
    .catch((err) => {
      // tslint:disable-next-line no-console
      console.log(err);
    });
}
