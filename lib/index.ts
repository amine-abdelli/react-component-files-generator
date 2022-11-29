#!/usr/bin/env node
// Check node version before requiring/doing anything else
// The user may be on a very old node version

import { runBuild } from "./builder/build";
import { runHelp } from "./help";
import { runInit } from "./init/init";
import { log } from "./utils";
const knownCommands = ['build', 'init', 'update', 'version', 'help'];
console.log('process.argv', process.argv);
if(process.argv[2] === 'build') {
  runBuild();
}
if(process.argv[2] === 'init' || process.argv[2] === 'update') {
  runInit();
}
if(process.argv[2] === 'version') {
  console.log('v1.0.1');
}
if(process.argv[2] === 'help') {
  runHelp();
}
if(!knownCommands.includes(process.argv[2])) {
  log('Oops! Something went wrong! :(');
  log(`The option '${process.argv[2]}' is not valid. Consider having a look at the help section :`);
  runHelp()
  process.exit(0);
}

