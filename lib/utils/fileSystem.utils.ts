import { ComponentNameTemplate } from '../constants/template';
import fs from 'fs';
import path from 'path';
import { IConfigObject } from '../types';
import { getFullFileNames } from './config.utils';
import { log } from './log.utils';
import { sanitizeConfigPaths } from './sanitize.utils';

/**
 * Create a config file filled with prompt user response
 * @param promptResponse 
 */
function writeJsonConfigFile(promptResponse: IConfigObject) {
  fs.writeFile("rcfg.config.json", JSON.stringify(promptResponse, null, 4), 'utf8', function (err) {
    if (err) {
      log("An error occured while writing JSON Object to File.");
      return log(err?.message);
    }
    log("rcfg.config.json created successfully !");
  });
}

/**
 * List dependencies from package.json's as an array of strings
 * @returns an array of dependencies e.g ['react', 'typescript', ...]
 */
function getProjectDependencies() {
  const jsonPackagePath = path.join(process.cwd() + '/package.json');
  const JsonPackage = JSON.parse(fs.readFileSync(jsonPackagePath, { encoding: 'utf8' }));
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
function writeFile(path: string, fileName: string, content: string) {
  createDirIfNotExist(path);
  fs.writeFile(`${path}/${fileName}`, content, err => {
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
  return fs.readFileSync(path.join(__dirname + `/../templates/${key}.template`), { encoding: 'utf8' });
}

/**
 * Check if next or react is installed
 * @returns true if react or next is found in dependencies
 */
function isReactOrNextInstalled() {
  const dependencies = getProjectDependencies();
  return dependencies.some((aDependency) => aDependency === 'next' || aDependency === 'react');
}

/**
 * Check if config file exists in the working directory
 * @returns true if rcfg.config.json file exists
 */
function doesConfigFileExists() {
  return fs.readdirSync('.').includes('rcfg.config.json');
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

function createFiles(config: IConfigObject, componentName: string, responseTypes: any[]) {  
  const { componentEntryPoint } = config;
  for (const [key, aConfig] of Object.entries(sanitizeConfigPaths(config, componentName))) {
  const FILE_NAMES = getFullFileNames(config, componentName);
    const PATH_TO_CREATE_IF_NOT_EXIST = aConfig.path?.replace(ComponentNameTemplate, componentName) || `${componentEntryPoint}/${componentName}`;
    const FILE_NAME = FILE_NAMES[key];
    if (!responseTypes.includes(key)) continue;
    writeFile(`${PATH_TO_CREATE_IF_NOT_EXIST}`, FILE_NAME, '');
  }
}

export {
  createDirIfNotExist, writeFile, readTemplateFile, getProjectDependencies, writeJsonConfigFile, doesConfigFileExists, isReactOrNextInstalled,
  findDependenciesFromJsonPackage, doesFileExists, createFiles
};