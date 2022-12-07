import fs from 'fs';
import { ComponentExportTemplate, ComponentImportTemplate, ComponentNameTemplate, PropsImportTemplate, PropsTemplate, StyleImportTemplate } from '../constants';
import { sanitizeConfigPaths, sanitizePath, createDirIfNotExist, buildFile, readTemplateFile, doesConfigFileExists, log, getFullFileNames } from '../utils';
import { quitPrompt } from '../utils/prompt.utils';
import { componentBuildPrompt } from './prompt.build';

export async function runBuild() {
  // Get configs from rcfg.config.json file
  if(!doesConfigFileExists()){
    log('We couldn\'t find any config file in your current working directory.', 'warning');
    log('     Please first run the following command : rcfg --init');
    quitPrompt();
  }
  const { name, componentEntryPoint, ...configRest } = JSON.parse(fs.readFileSync('rcfg.config.json', { encoding: 'utf8' }));
  // Clean component entry point path
  const COMPONENTS_ROOT_DIR = sanitizePath(componentEntryPoint);

  const { chosenComponentName: ComponentName, promptResponse } = await componentBuildPrompt(configRest, componentEntryPoint);

  const responsesType = promptResponse.map(({ type }) => type);
  const FILE_NAMES = getFullFileNames(configRest, ComponentName);
  
  const RELATIVE_PATH = `${COMPONENTS_ROOT_DIR}/${ComponentName}/`;

  // For each key create a file dynamically filled with template file's content
  for (const [key, aConfig] of Object.entries(sanitizeConfigPaths(configRest, ComponentName))) {
    const FILE_NAME = FILE_NAMES[key];
    createDirIfNotExist(RELATIVE_PATH);

    // Go to the next config if this one hasn't been picked by the user
    if (!responsesType.includes(key)) continue;

    if (key === 'component') {
      const componentExportString = aConfig.export === 'module' ? `{ ${ComponentName} }` : `default ${ComponentName}`;
      const STYLESHEET_IMPORT_PATH = `./${FILE_NAMES['style']}`;
      const PROPS_IMPORT_PATH = `./${FILE_NAMES['props']}`;
      const propsName = `${ComponentName}Props`;
      const styleImportString = configRest.style.module 
              ? `import styles from '${STYLESHEET_IMPORT_PATH}';` 
              : `import '${STYLESHEET_IMPORT_PATH}';`;

      const hasProps = responsesType.includes('props');
      const hasStyle = responsesType.includes('style');
      const propsImportString = hasProps ? `import { ${ComponentName}Props } from \'${PROPS_IMPORT_PATH}';` : '';
      const props = hasProps ? `: ${propsName}` : '';

      // Dynamically replace template's tags with the right content
      const formatedTemplate = JSON.stringify(readTemplateFile(key))
        .replace(new RegExp(ComponentNameTemplate, 'g'), ComponentName)
        .replace(new RegExp(ComponentExportTemplate, 'g'), componentExportString)
        .replace(new RegExp(StyleImportTemplate, 'g'), hasStyle ? styleImportString : '')
        .replace(new RegExp(PropsImportTemplate, 'g'), propsImportString)
        .replace(new RegExp(PropsTemplate, 'g'), props);

      // Build component file
      buildFile(`${RELATIVE_PATH}/${FILE_NAME}`, JSON.parse(formatedTemplate));
    }
    if (key === 'test') {
      const COMPONENT_IMPORT_PATH = `./${FILE_NAMES['component']}`;
      const FULL_COMPONENT_FILE_IMPORT_STRING = `import ${configRest.component.export === 'default' ? ComponentName : `{ ${ComponentName} }`} from '${COMPONENT_IMPORT_PATH}'`

      // Dynamically replace template's tags with the right content
      const formatedTemplate = JSON.stringify(readTemplateFile(key))
        .replace(new RegExp(ComponentNameTemplate, 'g'), ComponentName)
        .replace(new RegExp(ComponentImportTemplate, 'g'), FULL_COMPONENT_FILE_IMPORT_STRING);

      // Build test file
      buildFile(`${RELATIVE_PATH}/${FILE_NAME}`, JSON.parse(formatedTemplate));
    }
    if (key === 'props') {
      // Dynamically replace template's tags with the right content
      const formatedTemplate = JSON.stringify(readTemplateFile(key))
      .replace(new RegExp(ComponentNameTemplate, 'g'), ComponentName);

      // Build props file
      buildFile(`${COMPONENTS_ROOT_DIR}/${ComponentName}/${FILE_NAME}`, JSON.parse(formatedTemplate));
    }
    if (key === 'style') {
      // Build style sheet
      buildFile(`${RELATIVE_PATH}/${FILE_NAME}`, '');
    }

    buildFile(`${RELATIVE_PATH}/${FILE_NAME}`, '');
  }
};
