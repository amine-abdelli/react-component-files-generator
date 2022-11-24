import fs from 'fs';

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
  return fs.readFileSync(`./templates/${key}.template.ts`, { encoding: 'utf8' });
}

export { createDirIfNotExist, buildFile, readTemplateFile };