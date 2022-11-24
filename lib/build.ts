import fs, { writeFile } from 'fs';
import { ComponentExportTemplate, ComponentImportTemplate, ComponentNameTemplate, PathPolicyRegex, StyleImportTemplate } from '../constants';
import { sanitizeConfigPaths, sanitizePath, createDirIfNotExist, buildFile } from '../utils';
// Possibility to pass name in config "name": "Button"
// Propose when create file to prefill them or not
// Handle case user pick 'none' suffix

const ComponentName = 'Button';
const config = JSON.parse(fs.readFileSync('rfsb.config.json', { encoding: 'utf8' }));
const { name, componentEntryPoint, ...configRest } = config;
const COMPONENTS_ROOT_DIR = sanitizePath(componentEntryPoint);

for (const [key, aConfig] of Object.entries(sanitizeConfigPaths(configRest, ComponentName))) {
  const RELATIVE_PATH = aConfig.path || `${COMPONENTS_ROOT_DIR}/${ComponentName}/`;
  if (key === 'component') {
    createDirIfNotExist(RELATIVE_PATH);
    const COMPONENT_DIR = configRest.style.path ? `${configRest.style.path}/` : '';
    const FullStyleFileName = ComponentName + configRest.style.suffixExtension;
    const STYLESHEET_IMPORT_PATH = `./${COMPONENT_DIR}${FullStyleFileName};`
    const ComponentExport = aConfig.export === 'module'
              ? `{ ${ComponentName} }`
              : `default ${ComponentName}`;
    const StyleImport = config.style.import === 'module' 
              ? `import styles from '${STYLESHEET_IMPORT_PATH}'` 
              : `import '${STYLESHEET_IMPORT_PATH}'`;
    const template = JSON.stringify(fs.readFileSync(`./templates/${key}.template.ts`, { encoding: 'utf8' }));
    const formatedTemplate = template
      .replaceAll(ComponentNameTemplate, ComponentName)
      .replaceAll(ComponentExportTemplate, ComponentExport)
      .replaceAll(StyleImportTemplate, StyleImport);

    buildFile(`${RELATIVE_PATH}/${ComponentName}${aConfig.suffixExtension}`, JSON.parse(formatedTemplate));
  }
  if (key === 'test') {
    createDirIfNotExist(RELATIVE_PATH);
    const COMPONENT_DIR = configRest.component.path ? `${configRest.component.path}/` : '';
    const fullComponentName = `${ComponentName}${configRest.component.suffixExtension}`;
    const COMPONENT_IMPORT_PATH = `./${COMPONENT_DIR}${fullComponentName}`;
    const FULL_COMPONENT_FILE_EXPORT = `import ${configRest.component.export === 'default' ? ComponentName : `{ ${ComponentName} }`} from '${COMPONENT_IMPORT_PATH}'`

    const template = JSON.stringify(fs.readFileSync(`./templates/${key}.template.ts`, { encoding: 'utf8' }));
    const formatedTemplate = template
      .replaceAll(ComponentNameTemplate, ComponentName)
      .replaceAll(ComponentImportTemplate, FULL_COMPONENT_FILE_EXPORT);

    buildFile(`${RELATIVE_PATH}/${ComponentName}${aConfig.suffixExtension}`, JSON.parse(formatedTemplate));
  }
  if(key === 'props') {
    createDirIfNotExist(RELATIVE_PATH);
    const template = JSON.stringify(fs.readFileSync(`./templates/${key}.template.ts`, { encoding: 'utf8' }));
    const formatedTemplate = template
      .replaceAll(ComponentNameTemplate, ComponentName);

    buildFile(`${COMPONENTS_ROOT_DIR}/${ComponentName}/${ComponentName}${aConfig.suffixExtension}`, JSON.parse(formatedTemplate));
  }
  if(key === 'style') {
    createDirIfNotExist(RELATIVE_PATH);
    buildFile(`${RELATIVE_PATH}/${ComponentName}${aConfig.suffixExtension}`, '');
  }
}