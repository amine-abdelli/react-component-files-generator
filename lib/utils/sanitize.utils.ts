import { ComponentNameTemplate, PathPolicyRegex } from '../constants';

import { IConfigObject } from '../types';

/**
 * Remove ./ or / at the begining of the path and / at the end of the path
 * e.g "./components/Button/" => "components/Button"
 * @param path
 * @returns {string}
 */
function removeLeadingSlashes(path: string): string {
  return path.replace(/^(\.\/|\/)+/, '').replace(/\/+$/, '');
}

/**
 * Sanitize config object's paths
 * @param config
 * @param componentName {string} 
 * @returns a sanitized config object with all paths sanitized
 */
function sanitizeConfigPaths(config: IConfigObject, componentName: string) {
  for(const aConfig of Object.values(config)) {
    if(aConfig.path) aConfig.path = removeLeadingSlashes(aConfig.path).replace(ComponentNameTemplate, componentName);
  }
  return config;
}

export { sanitizeConfigPaths, removeLeadingSlashes}