import fs from 'fs';
import { ComponentExportTemplate, ComponentImportTemplate, ComponentNameTemplate, StyleImportTemplate } from '../constants';
import { sanitizeConfigPaths, sanitizePath, createDirIfNotExist, buildFile, readTemplateFile } from '../utils';

// Get configs from rfsb.config.json file
const { name, componentEntryPoint, ...configRest } = JSON.parse(fs.readFileSync('rfsb.config.json', { encoding: 'utf8' }));

// Clean path
const COMPONENTS_ROOT_DIR = sanitizePath(componentEntryPoint);
const ComponentName = 'Button';

// For each key create a file dynamically filled with template file's content
for (const [key, aConfig] of Object.entries(sanitizeConfigPaths(configRest, ComponentName))) {
  const RELATIVE_PATH = aConfig.path || `${COMPONENTS_ROOT_DIR}/${ComponentName}/`;
  createDirIfNotExist(RELATIVE_PATH);

  if (key === 'component') {
    const fullStyleFileName = ComponentName + configRest.style.suffixExtension;
    const componentExportString = aConfig.export === 'module' ? `{ ${ComponentName} }` : `default ${ComponentName}`;
    const STYLESHEET_DIRECTORY = configRest.style.path ? `${configRest.style.path}/` : '';
    const STYLESHEET_IMPORT_PATH = `./${STYLESHEET_DIRECTORY}${fullStyleFileName};`
    const styleImportString = configRest.style.import === 'module' ? `import styles from '${STYLESHEET_IMPORT_PATH}'` : `import '${STYLESHEET_IMPORT_PATH}'`;

    // Dynamically replace template's tags with the right content
    const formatedTemplate = JSON.stringify(readTemplateFile(key))
      .replaceAll(ComponentNameTemplate, ComponentName)
      .replaceAll(ComponentExportTemplate, componentExportString)
      .replaceAll(StyleImportTemplate, styleImportString);

    // Build component file
    buildFile(`${RELATIVE_PATH}/${ComponentName}${aConfig.suffixExtension}`, JSON.parse(formatedTemplate));
  }
  if (key === 'test') {
    const fullComponentName = `${ComponentName}${configRest.component.suffixExtension}`;
    const COMPONENT_DIR = configRest.component.path ? `${configRest.component.path}/` : '';
    const COMPONENT_IMPORT_PATH = `./${COMPONENT_DIR}${fullComponentName}`;
    const FULL_COMPONENT_FILE_IMPORT_STRING = `import ${configRest.component.export === 'default' ? ComponentName : `{ ${ComponentName} }`} from '${COMPONENT_IMPORT_PATH}'`

    // Dynamically replace template's tags with the right content
    const formatedTemplate = JSON.stringify(readTemplateFile(key))
      .replaceAll(ComponentNameTemplate, ComponentName)
      .replaceAll(ComponentImportTemplate, FULL_COMPONENT_FILE_IMPORT_STRING);

    // Build test file
    buildFile(`${RELATIVE_PATH}/${ComponentName}${aConfig.suffixExtension}`, JSON.parse(formatedTemplate));
  }
  if (key === 'props') {
    // Dynamically replace template's tags with the right content
    const formatedTemplate = JSON.stringify(readTemplateFile(key))
      .replaceAll(ComponentNameTemplate, ComponentName);

    // Build props file
    buildFile(`${COMPONENTS_ROOT_DIR}/${ComponentName}/${ComponentName}${aConfig.suffixExtension}`, JSON.parse(formatedTemplate));
  }
  if (key === 'style') {
    // Build style sheet
    buildFile(`${RELATIVE_PATH}/${ComponentName}${aConfig.suffixExtension}`, '');
  }
}