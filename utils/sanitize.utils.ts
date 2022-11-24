import { ComponentNameTemplate, PathPolicyRegex } from '../constants';

import { IConfigObject } from '../lib/types';

/**
 * Remove ./ or / at the begining of the path and / at the end of the path
 * e.g ./components/Button/ => components/Button
 * @param path
 * @returns {string}
 */
function sanitizePath(path: string): string {
  let sanitizedPath = path;
  if(path.at(-1) === '/') {
    sanitizedPath = path.slice(0, -1);
  }
  return sanitizedPath.replace(PathPolicyRegex, '');
}

/**
 * Sanitize config object's paths
 * @param config
 * @param componentName {string} 
 * @returns a sanitized config object with all paths sanitized
 */
function sanitizeConfigPaths(config: IConfigObject, componentName: string) {
  for(const aConfig of Object.values(config)) {
    if(aConfig.path) aConfig.path = sanitizePath(aConfig.path).replace(ComponentNameTemplate, componentName);
  }
  return config;
}

export { sanitizeConfigPaths, sanitizePath}