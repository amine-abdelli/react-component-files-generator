import fs from 'fs';
import { IConfigObject } from '../types';
import { log } from './log.utils';

/**
 * Create a config file filled with prompt user response
 * @param promptResponse 
 */
function writeJsonConfigFile(promptResponse: IConfigObject) {
  fs.writeFile("rfsb.config.json", JSON.stringify(promptResponse, null, 4), 'utf8', function (err) {
    if (err) {
      log("An error occured while writing JSON Object to File.");
      return log(err?.message);
    }
    log("rfsb.config.json created successfully !");
  });
}

/**
 * List dependencies from package.json's as an array of strings
 * @returns an array of dependencies e.g ['react', 'typescript', ...]
 */
function getProjectDependencies() {
  const JsonPackage = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' }));
  return Object.keys({
    ...JsonPackage.dependencies,
    ...JsonPackage.devDependencies
  });
}

/**
 * Create given path if it doesn't exists yet
 * @param path {string} the path we want to create if it doesn't exists
 */
function createDirIfNotExist(path: string): void {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

/**
 * Create a file at the provided path filled with content
 * @param path 
 * @param content The content we want to populate the new file with
 */
function buildFile(path: string, content: string) {
  fs.writeFile(path, content, err => {
    if (err) {
      console.error(err);
    }
  });
}

/**
 * Read template file based on template key
 * @param key 'component' | 'style' | 'test' | 'props' | 'fixture'
 * @returns a template file
 */
function readTemplateFile(key: string): string {
  return fs.readFileSync(`./lib/templates/${key}.template`, { encoding: 'utf8' });
}

/**
 * Check if next or react is installed
 * @returns true if react or next is found in dependencies
 */
function isReactOrNextInstalled() {
  const dependencies = getProjectDependencies();
  return !!dependencies.filter((aDependency) => aDependency === 'next' || aDependency === 'react').length;
}

/**
 * Check if config file exists in the working directory
 * @returns true if rfsb.config.json file exists
 */
function doesConfigFileExists() {
  return fs.readdirSync('.').includes('rfsb.config.json');
};

/**
 * Check if given lib/libraries exists in package.json
 * Also handle the case where 2 different libraries are installed e.g react and next.js
 * @param lib string | string[]
 * @returns an array of strings
 */
function findDependenciesFromJsonPackage(lib: string | string[]) {
  const dependencies = getProjectDependencies();
  if (typeof lib === 'string') {
    return dependencies.find((aDependency) => aDependency === lib);
  } else {
    for (const aLib of lib) {
      const foundDependency = dependencies.find((aDependency) => aDependency === aLib)
      if (foundDependency?.length) {
        return foundDependency;
      }
    }
  }
}

/**
 * Check if a file exists in the give directory
 * @param componentName 
 * @param componentDir 
 * @returns true if the file exists in the given directory
 */
function doesFileExists(componentName: string, componentDir: string) {
  if(!fs.existsSync(componentDir)) return false;
  const dir = fs.readdirSync(componentDir);
  return dir.includes(componentName)
}

export {
  createDirIfNotExist, buildFile, readTemplateFile, getProjectDependencies, writeJsonConfigFile, doesConfigFileExists, isReactOrNextInstalled,
  findDependenciesFromJsonPackage, doesFileExists
};