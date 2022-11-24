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

export { createDirIfNotExist };