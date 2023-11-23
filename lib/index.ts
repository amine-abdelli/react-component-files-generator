#!/usr/bin/env node

import { runBuild, runHelp, runInit } from 'commands';
import jsonPackage from '../package.json';
import { log } from 'utils';

const knownOptions = ['--build', '-b', '--init', '-i', '--update', '-u', '--version', '-v', '--help', '-h'];

if (process.argv[2] === '--build' || process.argv[2] === '-b') {
  runBuild();
}
if (process.argv[2] === '--init' || process.argv[2] === '-i' || process.argv[2] === '--update' || process.argv[2] === '-u') {
  runInit();
}
if (process.argv[2] === '--version' || process.argv[2] === '-v') {
  console.log(`v${jsonPackage.version}`);
}
if (process.argv[2] === '--help' || process.argv[2] === '-h') {
  runHelp();
}
if (!knownOptions.includes(process.argv[2])) {
  log('Oops! Something went wrong! :(');
  log(`The option '${process.argv[2]}' is not valid. Consider having a look at the help section :`);
  runHelp()
  process.exit(0);
}
