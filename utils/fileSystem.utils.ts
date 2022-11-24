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

export { createDirIfNotExist, buildFile };