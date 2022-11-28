const fs = require('fs');
const path = require('path');
const FILE_NAMES = ['Button.component.tsx',
'Button.spec.tsx',
'Button.style.css']
/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 * 
 * @see http://stackoverflow.com/a/5827895/4241030
 * @param {String} dir 
 */
export function filewalker(dir: any) {
  const RESULTS: string[] = []
  fs.readdir(dir, {}, function (_: any, list: any) {
    list
      .filter((folder: string) => folder !== 'node_modules' && folder !== '.git')
      .forEach(function (file: any) {
        if(FILE_NAMES.includes(file)) {
          RESULTS.push(path.resolve(dir, file))
          console.log(path.resolve(dir, file))
        }
        if(FILE_NAMES.length === RESULTS.length) return RESULTS
        file = path.resolve(dir, file);
        fs.stat(file, function (err: any, stat: any) {
          // If directory, execute a recursive call
          if (stat && stat.isDirectory()) {
            filewalker(file);
          }
        });
      });
      return RESULTS;
  });
};