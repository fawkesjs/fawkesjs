#!/usr/bin/env node
import * as program from 'commander'
import { Fawkes } from '../lib/fawkes'
require('ts-node/register')
program
  .version('0.0.1')
  .option('-s, --swagger [value]', 'generate swagger document location')
program.parse(process.argv);
if (program.swagger) {
  Fawkes.generateSwaggerAsync(program.swagger)
    .then(tmp => {
      console.log(tmp)
    })
    .catch(err => {
      console.log(err)
    })
}
