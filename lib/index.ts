#!/usr/bin/env node

import { runBuild } from "./builder/build";
import { runHelp } from "./help";
import { runInit } from "./init/init";
import { log } from "./utils";
import jsonPackage from '../package.json';

const knownOptions = ['--build', '-b', '--init', '-i', '--update', '-u', '--version', '-v', '--help', '-h'];

if(process.argv[2] === '--build' || process.argv[2] === '--b') {
  runBuild();
}
if(process.argv[2] === '--init' || process.argv[2] === '-i' || process.argv[2] === '--update' || process.argv[2] === '-u') {
  runInit();
}
if(process.argv[2] === '--version' || process.argv[2] === '-v') {
  console.log(`v${jsonPackage.version}`);
}
if(process.argv[2] === '--help' || process.argv[2] === '-h') {
  runHelp();
}
if(!knownOptions.includes(process.argv[2])) {
  log('Oops! Something went wrong! :(');
  log(`The option '${process.argv[2]}' is not valid. Consider having a look at the help section :`);
  runHelp()
  process.exit(0);
}

// TODO: Check node version before requiring/doing anything else
// TODO : When we have no style import go one line upward'\b'
// TODO : "fill": false     /* if user doesn't want his file filled up
// TODO : Trigger errors when necessary like if there is 2 files that could have the same name in the same folder in case of nameExtension missing 
// TODO : Make it possible to change file name like Button.component.tsx ButtonProps.ts
// TODO : Make it possible to add pages
// !: The user may be on a very old node version