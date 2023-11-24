import fs from 'fs';
import { generateFullPath } from '../utils/path.utils';
import { CONFIG_FILE_NAME, ComponentExportTemplate, ComponentImportTemplate, ComponentNameTemplate, PropsImportTemplate, PropsTemplate, StyleImportTemplate } from '../constants';
import { sanitizeConfigPaths, removeLeadingSlashes, writeFile, readTemplateFile, doesConfigFileExists, log, getFullFileNames, createFiles } from '../utils';
import { quitPrompt } from '../utils/prompt.utils';
import { componentBuildPrompt } from '../prompts/build.prompt';

export async function runBuild() {
  // Get configs from rcfg.config.json file
  if (!doesConfigFileExists()) {
    log('We couldn\'t find any config file in your current working directory.', 'warning');
    log('     Please first run the following command : rcfg --init');
    quitPrompt();
  }
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE_NAME, { encoding: 'utf8' }));
  const { name, componentEntryPoint, ...configRest } = config;
  // Clean component entry point path
  const COMPONENTS_ROOT_DIR = removeLeadingSlashes(componentEntryPoint);

  const { chosenComponentName: ComponentName, promptResponse } = await componentBuildPrompt(configRest, componentEntryPoint);

  const responsesType = promptResponse.map(({ type }) => type);
  const FILE_NAMES = getFullFileNames(configRest, ComponentName);

  const RELATIVE_PATH = `${COMPONENTS_ROOT_DIR}/${ComponentName}/`;
  // Create all files
  // We need to create files first in order to get dynamically generated imports at the right place
  createFiles(config, ComponentName, responsesType);

  // For each key create a file dynamically filled with template file's content
  for (const [key, aConfig] of Object.entries(sanitizeConfigPaths(configRest, ComponentName))) {
    const PATH_TO_CREATE_IF_NOT_EXIST = aConfig.path?.replace(ComponentNameTemplate, ComponentName) || RELATIVE_PATH;
    const FILE_NAME = FILE_NAMES[key];

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
      writeFile(PATH_TO_CREATE_IF_NOT_EXIST, FILE_NAME, JSON.parse(formatedTemplate));
    }
    if (key === 'test') {
      const COMPONENT_IMPORT_PATH = `./${FILE_NAMES['component']}`;
      const FULL_COMPONENT_FILE_IMPORT_STRING = `import ${configRest.component.export === 'default' ? ComponentName : `{ ${ComponentName} }`} from '${COMPONENT_IMPORT_PATH}'`

      // Dynamically replace template's tags with the right content
      const formatedTemplate = JSON.stringify(readTemplateFile(key))
        .replace(new RegExp(ComponentNameTemplate, 'g'), ComponentName)
        .replace(new RegExp(ComponentImportTemplate, 'g'), FULL_COMPONENT_FILE_IMPORT_STRING);

      // Build test file
      writeFile(PATH_TO_CREATE_IF_NOT_EXIST, FILE_NAME, JSON.parse(formatedTemplate));
    }
    if (key === 'props') {
      // Dynamically replace template's tags with the right content
      const formatedTemplate = JSON.stringify(readTemplateFile(key))
        .replace(new RegExp(ComponentNameTemplate, 'g'), ComponentName);

      // Build props file
      writeFile(`${PATH_TO_CREATE_IF_NOT_EXIST}`, FILE_NAME, JSON.parse(formatedTemplate));
    }
    if (key === 'style') {
      // Build style sheet
      writeFile(PATH_TO_CREATE_IF_NOT_EXIST, FILE_NAME, '');
    }

    writeFile(PATH_TO_CREATE_IF_NOT_EXIST, FILE_NAME, '');
  }
};
